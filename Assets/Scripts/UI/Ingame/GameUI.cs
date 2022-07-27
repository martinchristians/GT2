using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace UI.Ingame {

    public class GameUI : MonoBehaviour {

        public static GameUI instance { get; private set; }

        [SerializeField] Canvas m_canvas;

        [field: SerializeField] public CountdownUI countdown;

        public bool visible {
            get => m_canvas.enabled;
            set => m_canvas.enabled = value;
        }

        public static void EnsureExists () {
            if(instance == null){
                DontDestroyOnLoad(Instantiate(CoreSystems.GameConfig.instance.gameUiPrefab));
            }
        }
        
        void Awake () {
            if(instance != null){
                Debug.LogError($"Singleton violation, instance of {nameof(GameUI)} isn't null!");
                Destroy(this.gameObject);
                return;
            }
            instance = this;
        }

        void OnDestroy () {
            if(ReferenceEquals(instance, this)){
                instance = null;
            }
        }

    }

}