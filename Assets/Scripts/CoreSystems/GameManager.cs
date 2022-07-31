using System.Linq;
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

        public const int MAIN_MENU_SCENE_INDEX = 0;
        public const int TUTORIAL_SCENE_INDEX = 1;
        public const int ENDLESS_RUNNER_SCENE_INDEX = 2;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void CreateInstance () {
            DontDestroyOnLoad(new GameObject("[Game Manager]", typeof(GameManager)));
        }

        bool m_loading = false;
        bool m_currentlyGameOver = false;
        Coroutine m_gameOverSequence = null;

        int _nextScene = -1;
        int nextScene {
            get => _nextScene;
            set {
                _nextScene = value;
                // Debug.Log("next scene queued: " + value);
            }
        }

        static List<PlayerData> m_currentLevelPlayers = new List<PlayerData>();
        static List<PlayerData> m_currentLevelSpectators = new List<PlayerData>();

        static bool IsInScene (int sceneIndex) => SceneManager.GetActiveScene().buildIndex == sceneIndex;
        static bool isInMainMenu => IsInScene(MAIN_MENU_SCENE_INDEX);
        static bool isInTutorial => IsInScene(TUTORIAL_SCENE_INDEX);
        static bool isInLevel => IsInScene(ENDLESS_RUNNER_SCENE_INDEX);
        // static GamepadLayout currentLayout => (SceneManager.GetActiveScene().buildIndex == 3) ? GamepadLayout.jump : GamepadLayout.standard;
        static GamepadLayout currentLayout => GamepadLayout.standard;

        public static bool isPaused { get; private set; }
        public static PlayerData pausedByPlayerData { get; private set; }

        public static PlayerData tutorialRequesterPlayerData { get; private set; }

        public static IReadOnlyList<PlayerData> players => m_currentLevelPlayers;
        public static IReadOnlyList<PlayerData> spectators => m_currentLevelSpectators;

        void Awake () {
            SaveFile.ReadFromDisk();
            UI.Ingame.GameUI.EnsureExists();
            UI.PauseMenu.EnsureExists();
            UI.GameOver.GameOverUI.EnsureExists();
            SFX.EnsureExists();
            GameClient.onTutorialRequested += OnTutorialRequested;
            GameClient.onLevelStartRequested += OnLevelRequested;
            GameClient.onMainMenuRequested += OnMainMenuRequested;
            GameClient.onPlayerLeft += OnPlayerLeft;
            GameClient.onPlayerJoined += OnPlayerJoined;
            GameClient.onPauseRequested += OnPauseRequested;
            GameClient.onUnpauseRequested += OnUnPauseRequested;
            UI.GameOver.GameOverUI.Hide();
            UI.Ingame.GameUI.instance.visible = isInLevel;
            if(isInLevel){
                UI.Ingame.GameUI.instance.OnNewLevel();
                SpawnCarAndResume();
            }

            void OnTutorialRequested (PlayerData tutorialRequester) {
                if(m_loading || isInTutorial){
                    return;
                }
                tutorialRequesterPlayerData = tutorialRequester;
                nextScene = TUTORIAL_SCENE_INDEX;
            }

            void OnLevelRequested (int requestedLevel) {
                if(m_loading || isInLevel){
                    return;
                }
                nextScene = requestedLevel;
            }

            void OnMainMenuRequested (PlayerData mainMenuPlayer) {
                if(m_loading || isInMainMenu){
                    return;
                }
                if(isInLevel && isPaused){
                    if(!mainMenuPlayer.Equals(pausedByPlayerData)){
                        return;
                    }
                }
                nextScene = MAIN_MENU_SCENE_INDEX;
            }

            void OnPlayerLeft (PlayerData leftPlayer) {
                if(m_loading || isInMainMenu){
                    return;
                }
                if(isInTutorial){
                    if(leftPlayer.id == tutorialRequesterPlayerData.id){
                        nextScene = MAIN_MENU_SCENE_INDEX;
                    }
                }
                if(isInLevel){
                    m_currentLevelPlayers.Remove(leftPlayer);
                    m_currentLevelSpectators.Remove(leftPlayer);
                    if(m_currentLevelPlayers.Count < 1){
                        nextScene = MAIN_MENU_SCENE_INDEX;
                    }
                    IngameButtonLayout.ApplyForPlayers(m_currentLevelPlayers);
                    if(isPaused && leftPlayer.Equals(pausedByPlayerData)){
                        Unpause();
                    }
                }
            }

            void OnPlayerJoined (PlayerData newPlayer) {
                if(m_loading || isInMainMenu){
                    return;
                }
                m_currentLevelSpectators.Add(newPlayer);
                GameClient.SendLevelStarted(newPlayer.id, currentLayout);
                GameClient.SendButtonsEnabled(newPlayer.id, Button.all, false);
                if(isInTutorial || isPaused){
                    GameClient.UpdatePauseState(pausedByPlayerData.id, true);
                }
            }

            void OnPauseRequested (PlayerData pausePlayer) {
                if(!m_loading && isInLevel && !isPaused && IsAnActivePlayer(pausePlayer) && !m_currentlyGameOver){
                    Pause(pausePlayer);
                }
            }

            void OnUnPauseRequested (PlayerData unpausePlayer) {
                if(m_loading){
                    return;
                }
                if(isInTutorial && pausedByPlayerData.Equals(unpausePlayer)){
                    nextScene = ENDLESS_RUNNER_SCENE_INDEX;
                }
                if(isInLevel){
                    if(m_currentlyGameOver){
                        nextScene = SceneManager.GetActiveScene().buildIndex;
                    }else if(isPaused && pausedByPlayerData.Equals(unpausePlayer)){
                        Unpause();
                    }
                }
            }
        }

        void Update () {
            if(m_loading){
                return;
            }
            if(nextScene >= 0){
                StartCoroutine(LoadScene(nextScene));
                nextScene = -1;
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
            UI.GameOver.GameOverUI.Hide();
            UI.Ingame.GameUI.instance.visible = isInLevel;
            if(isInLevel){
                UI.Ingame.GameUI.instance.OnNewLevel();
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
                    nextScene = MAIN_MENU_SCENE_INDEX;
                }
                SpawnCarAndResume();
            }
            if(isInMainMenu){
                GameClient.SendMainMenuOpened();
            }
            if(isInTutorial){
                var tutorialRequesterStillInLobby = GameClient.connectedPlayers.Any((pd) => pd.id == tutorialRequesterPlayerData.id);
                if(!tutorialRequesterStillInLobby && GameClient.connectedPlayers.Count > 0){
                    tutorialRequesterPlayerData = GameClient.connectedPlayers[0];
                    tutorialRequesterStillInLobby = true;
                }
                if(tutorialRequesterStillInLobby){
                    GameClient.SendLevelStarted(GamepadLayout.standard);    // HACK because i need the players to have the game layout
                    Pause(tutorialRequesterPlayerData);
                }else{
                    nextScene = MAIN_MENU_SCENE_INDEX;
                }
            }else{
                Unpause();
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
            if(isInLevel){
                UI.PauseMenu.instance.Show(pausePlayer.name);
                Time.timeScale = 0f;
            }
            GameClient.UpdatePauseState(pausePlayer.id, true);
        }

        void Unpause () {
            isPaused = false;
            pausedByPlayerData = default;
            UI.PauseMenu.instance.Hide();
            Time.timeScale = 1f;
            GameClient.UpdatePauseState(-1, false);
        }

        void OnPlayerDeath () {
            m_currentlyGameOver = true;
            if(Level.current != null){
                var newSaveData = Level.current.GetSaveData();
                m_gameOverSequence = StartCoroutine(GameOverSequence(newSaveData));
                if(!SaveFile.TryGetLevelSaveData(newSaveData.levelName, out var existingSaveData) || newSaveData.IsBetterThan(existingSaveData)){
                    SaveFile.SetLevelSaveData(newSaveData);
                }
                SaveFile.IncreaseCoinCounter(newSaveData.coinsCollected);
                SaveFile.IncreaseTotalPlayTime(newSaveData.playDuration);
                SaveFile.WriteToDisk();
            }else{
                m_gameOverSequence = StartCoroutine(GameOverSequence(default));
            }
        }

        IEnumerator GameOverSequence (Level.SaveData levelSaveData) {
            yield return new WaitForSecondsRealtime(2);
            UI.GameOver.GameOverUI.Show(levelSaveData);
            Time.timeScale = 0f;
            if(GameClient.connected){
                yield return new WaitForSecondsRealtime(2);
                GameClient.UpdatePauseState(players[0].id, true);
            }
        }

    }

}