using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using Communication;

namespace CoreSystems {

    public class GameManager : MonoBehaviour {

        const int MAIN_MENU_SCENE_INDEX = 0;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void CreateInstance () {
            DontDestroyOnLoad(new GameObject("[Game Manager]", typeof(GameManager)));
        }

        bool m_loading = false;
        int m_nextScene = -1;
        List<PlayerData> m_currentLevelPlayers = new List<PlayerData>();

        bool isInLevel => UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex > 0;

        void Awake () {
            GameClient.onLevelStartRequested += OnLevelRequested;
            GameClient.onMainMenuRequested += OnMainMenuRequested;
            // GameClient.onPlayersChanged += () => m_playersChanged = true;
            GameClient.onPlayerLeft += OnPlayerLeft;
            GameClient.onPlayerJoined += OnPlayerJoined;

            void OnLevelRequested (int requestedLevel) {
                if(m_loading || isInLevel){
                    return;
                }
                m_nextScene = requestedLevel;
            }

            void OnMainMenuRequested () {
                if(m_loading || !isInLevel){
                    return;
                }
                m_nextScene = MAIN_MENU_SCENE_INDEX;
            }

            void OnPlayerLeft (PlayerData leftPlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                m_currentLevelPlayers.Remove(leftPlayer);
                if(m_currentLevelPlayers.Count < 1){
                    m_nextScene = MAIN_MENU_SCENE_INDEX;
                }else{
                    IngameButtonLayout.ApplyForPlayers(m_currentLevelPlayers);
                }
            }

            void OnPlayerJoined (PlayerData newPlayer) {
                if(m_loading || !isInLevel){
                    return;
                }
                GameClient.SendLevelStarted(newPlayer.id);
                GameClient.SendButtonsEnabled(newPlayer.id, Button.all, false);
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
            m_loading = true;
            yield return SceneManager.LoadSceneAsync(sceneIndex);
            if(sceneIndex > MAIN_MENU_SCENE_INDEX){
                GameClient.ResetButtonsPressed();
                GameClient.SendLevelStarted();
                m_currentLevelPlayers.Clear();
                var otherPlayers = new List<PlayerData>();
                foreach(var player in GameClient.connectedPlayers){
                    if(m_currentLevelPlayers.Count < 4){
                        m_currentLevelPlayers.Add(player);
                    }else{
                        otherPlayers.Add(player);
                    }
                }
                if(m_currentLevelPlayers.Count > 0){
                    IngameButtonLayout.ApplyForPlayers(m_currentLevelPlayers);
                    foreach(var player in otherPlayers){
                        GameClient.SendButtonsEnabled(player.id, Button.all, false);
                    }
                }else{
                    m_nextScene = MAIN_MENU_SCENE_INDEX;
                }
                var spawn = CarSpawn.instance;
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
                spawn.SpawnCar();
            }else{
                GameClient.SendMainMenuOpened();
            }
            m_loading = false;
        }

    }

}