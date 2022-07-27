using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using Communication;

namespace CoreSystems {

    public class GameManager : MonoBehaviour {

#if UNITY_EDITOR

        const string START_WITH_COUNTDOWN_KEY = "startWithCountdown";

        [UnityEditor.MenuItem("Custom/Countdown/Enable")]
        static void EnableCountdown () => UnityEditor.EditorPrefs.SetBool(START_WITH_COUNTDOWN_KEY, true);

        [UnityEditor.MenuItem("Custom/Countdown/Enable", true)]
        static bool EnableCountdownEnabled () => !UnityEditor.EditorPrefs.GetBool(START_WITH_COUNTDOWN_KEY, true);

        [UnityEditor.MenuItem("Custom/Countdown/Disable")]
        static void DisableCountdown () => UnityEditor.EditorPrefs.SetBool(START_WITH_COUNTDOWN_KEY, false);

        [UnityEditor.MenuItem("Custom/Countdown/Disable", true)]
        static bool DisableCountdownEnabled () => UnityEditor.EditorPrefs.GetBool(START_WITH_COUNTDOWN_KEY, true);

#endif

        const int MAIN_MENU_SCENE_INDEX = 0;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void CreateInstance () {
            DontDestroyOnLoad(new GameObject("[Game Manager]", typeof(GameManager)));
        }

        bool m_loading = false;
        int m_nextScene = -1;
        bool m_currentlyGameOver = false;
        Coroutine m_gameOverSequence = null;

        static List<PlayerData> m_currentLevelPlayers = new List<PlayerData>();
        static List<PlayerData> m_currentLevelSpectators = new List<PlayerData>();

        static bool isInLevel => SceneManager.GetActiveScene().buildIndex != 0;
        static GamepadLayout currentLayout => (SceneManager.GetActiveScene().buildIndex == 3) ? GamepadLayout.jump : GamepadLayout.standard;

        public static bool isPaused { get; private set; }
        public static PlayerData pausedByPlayerData { get; private set; }

        public static IReadOnlyList<PlayerData> players => m_currentLevelPlayers;
        public static IReadOnlyList<PlayerData> spectators => m_currentLevelSpectators;

        void Awake () {
            SaveFile.ReadFromDisk();
            UI.Ingame.GameUI.EnsureExists();
            UI.PauseMenu.EnsureExists();
            SFX.EnsureExists();
            GameClient.onLevelStartRequested += OnLevelRequested;
            GameClient.onMainMenuRequested += OnMainMenuRequested;
            GameClient.onPlayerLeft += OnPlayerLeft;
            GameClient.onPlayerJoined += OnPlayerJoined;
            GameClient.onPauseRequested += OnPauseRequested;
            GameClient.onUnpauseRequested += OnUnPauseRequested;
            UI.Ingame.GameUI.instance.visible = isInLevel;
            if(isInLevel){
                UI.Ingame.GameUI.instance.OnNewLevel();
                SpawnCarAndResume();
            }

            void OnLevelRequested (int requestedLevel) {
                if(m_loading || isInLevel){
                    return;
                }
                m_nextScene = requestedLevel;
            }

            void OnMainMenuRequested (PlayerData mainMenuPlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                if(isPaused){
                    if(!mainMenuPlayer.Equals(pausedByPlayerData)){
                        return;
                    }
                }
                m_nextScene = MAIN_MENU_SCENE_INDEX;
            }

            void OnPlayerLeft (PlayerData leftPlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                m_currentLevelPlayers.Remove(leftPlayer);
                m_currentLevelSpectators.Remove(leftPlayer);
                if(m_currentLevelPlayers.Count < 1){
                    m_nextScene = MAIN_MENU_SCENE_INDEX;
                }else{
                    IngameButtonLayout.ApplyForPlayers(m_currentLevelPlayers);
                    if(isPaused && leftPlayer.Equals(pausedByPlayerData)){
                        Unpause();
                    }
                }
            }

            void OnPlayerJoined (PlayerData newPlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                m_currentLevelSpectators.Add(newPlayer);
                GameClient.SendLevelStarted(newPlayer.id, currentLayout);
                GameClient.SendButtonsEnabled(newPlayer.id, Button.all, false);
            }

            void OnPauseRequested (PlayerData pausePlayer) {
                if(!m_loading && isInLevel && !isPaused && IsAnActivePlayer(pausePlayer) && !m_currentlyGameOver){
                    Pause(pausePlayer);
                }
            }

            void OnUnPauseRequested (PlayerData unpausePlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                if(m_currentlyGameOver){
                    m_nextScene = SceneManager.GetActiveScene().buildIndex;
                }else if(isPaused && pausedByPlayerData.Equals(unpausePlayer)){
                    Unpause();
                }
            }
        }

        void Update () {
            if(m_loading){
                return;
            }
            if(m_nextScene >= 0){
                StartCoroutine(LoadScene(m_nextScene));
                m_nextScene = -1;
            }
        }

        IEnumerator LoadScene (int sceneIndex) {
            if(m_loading){
                Debug.LogError($"Already loading, aborting call to load scene \"{sceneIndex}\"!");
                yield break;
            }
            var path = SceneUtility.GetScenePathByBuildIndex(sceneIndex);
            if(string.IsNullOrWhiteSpace(path)){
                Debug.LogError($"Invalid scene index \"{sceneIndex}\"!");
                yield break;
            }
            if(m_gameOverSequence != null){
                StopCoroutine(m_gameOverSequence);
                m_gameOverSequence = null;
            }
            m_loading = true;
            yield return SceneManager.LoadSceneAsync(sceneIndex);
            if(sceneIndex > MAIN_MENU_SCENE_INDEX){
                GameClient.ResetButtonsPressed();
                GameClient.SendLevelStarted(currentLayout);
                m_currentLevelPlayers.Clear();
                m_currentLevelSpectators.Clear();
                foreach(var player in GameClient.connectedPlayers){
                    if(m_currentLevelPlayers.Count < 4){
                        m_currentLevelPlayers.Add(player);
                    }else{
                        m_currentLevelSpectators.Add(player);
                    }
                }
                if(m_currentLevelPlayers.Count > 0){
                    IngameButtonLayout.ApplyForPlayers(m_currentLevelPlayers);
                    foreach(var player in m_currentLevelSpectators){
                        GameClient.SendButtonsEnabled(player.id, Button.all, false);
                    }
                }else{
                    m_nextScene = MAIN_MENU_SCENE_INDEX;
                }
                UI.Ingame.GameUI.instance.OnNewLevel();
                SpawnCarAndResume();
            }else{
                GameClient.SendMainMenuOpened();
            }
            m_loading = false;
        }

        void SpawnCarAndResume () {
            m_currentlyGameOver = false;
            var spawn = CarSpawn.current;
            if(spawn == null){
                Debug.LogWarning("Car spawn instance not set, looking via GameObject.FindObjectOfType.");
                spawn = GameObject.FindObjectOfType<CarSpawn>();
                if(spawn == null){
                    Debug.LogError("No spawn point found, doing default spawn!");
                    spawn = new GameObject("Emergency Spawn").AddComponent<CarSpawn>();
                    spawn.transform.position = Vector3.up;
                    spawn.transform.rotation = Quaternion.identity;
                }
            }
            var car = spawn.SpawnCar();
            car.onDied += OnPlayerDeath;
            if(GameClient.connected){
                Unpause();
            }
#if UNITY_EDITOR
            if(!UnityEditor.EditorPrefs.GetBool(START_WITH_COUNTDOWN_KEY, true)){
                if(Level.current != null){
                    Level.current.StartTimer();
                }
                return;
            }
#endif
            car.inputBlocked = true;
            UI.Ingame.GameUI.instance.countdown.DoCountdown(() => {
                car.inputBlocked = false;
                if(Level.current != null){
                    Level.current.StartTimer();
                }
            });
        }

        bool IsAnActivePlayer (PlayerData playerToCheck) {
            foreach(var currentPlayer in m_currentLevelPlayers){
                if(currentPlayer.id == playerToCheck.id){
                    return true;
                }
            }
            return false;
        }

        void Pause (PlayerData pausePlayer) {
            isPaused = true;
            pausedByPlayerData = pausePlayer;
            UI.PauseMenu.instance.Show(pausePlayer.name);
            GameClient.UpdatePauseState(pausePlayer.id, true);
            Time.timeScale = 0f;
        }

        void Unpause () {
            isPaused = false;
            pausedByPlayerData = default;
            UI.PauseMenu.instance.Hide();
            GameClient.UpdatePauseState(-1, false);
            Time.timeScale = 1f;
        }

        // TODO also have a successful end
        // player death should be ignored after that
        // input should still be off and the handing the same
        // the whole game over sequence should be the same tbh
        // with the camera stuck and all that
        // just with more health
        // save data probably needs a "success" field
        // so that you can't fail the timed challenge but have a better score because you failed faster

        void OnPlayerDeath () {
            m_currentlyGameOver = true;
            m_gameOverSequence = StartCoroutine(GameOverSequence());
            if(Level.current != null){
                var newSaveData = Level.current.GetSaveData();
                if(!SaveFile.TryGetLevelSaveData(newSaveData.levelName, out var existingSaveData) || newSaveData.IsBetterThan(existingSaveData)){
                    SaveFile.SetLevelSaveData(newSaveData);
                }
                SaveFile.IncreaseCoinCounter(newSaveData.coinsCollected);
                SaveFile.IncreaseTotalPlayTime(newSaveData.playDuration);
            }
        }

        IEnumerator GameOverSequence () {
            yield return new WaitForSeconds(2);
            // show game over screen in ui
            if(GameClient.connected){
                yield return new WaitForSeconds(2);
                GameClient.UpdatePauseState(players[0].id, true);
            }
        }

    }

}