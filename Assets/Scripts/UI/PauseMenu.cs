using UnityEngine;
using TMPro;
using CoreSystems;

namespace UI {

    public class PauseMenu : MonoBehaviour {

        public static PauseMenu instance { get; private set; }
        
        public static void EnsureExists () {
            if(instance == null){
                DontDestroyOnLoad(Instantiate(GameConfig.instance.pauseMenuPrefab).gameObject);
            }
        }

        [SerializeField] Canvas m_canvas;
        [SerializeField] TextMeshProUGUI m_playerName;

        void Awake () {
            if(instance != null){
                Debug.LogError($"Singleton violation of {nameof(PauseMenu)}, destroying gameobject!");
                Destroy(this.gameObject);
                return;
            }
            instance = this;
            if(GameManager.isPaused){
                Show(GameManager.pausedByPlayerData.name);
            }else{
                Hide();
            }
        }

        void OnDestroy () {
            if(ReferenceEquals(this, instance)){
                instance = null;
            }
        }

        public void Show (string playerName) {
            m_playerName.text = $"Paused by \"{playerName}\"";
            m_canvas.enabled = true;
        }

        public void Hide () {
            m_canvas.enabled = false;
        }

    }

}