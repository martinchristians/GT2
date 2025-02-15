using UnityEngine;

namespace UI.Ingame {

    public class GameUI : MonoBehaviour {

        public static GameUI instance { get; private set; }

        [SerializeField] Canvas m_canvas;

        [field: SerializeField] public CountdownUI countdown;
        [field: SerializeField] public TimerUI timer;
        [field: SerializeField] public DistanceUI distance;
        [field: SerializeField] public LevelInfoUI levelInfo;

        public bool visible {
            get => gameObject.activeSelf;
            set => gameObject.SetActive(value);
        }

        public static void EnsureExists () {
            if(instance == null){
                DontDestroyOnLoad(Instantiate(CoreSystems.GameConfig.instance.gameUiPrefab));
            }
        }

        public void OnNewLevel () {
            countdown.Initialize();
            timer.Initialize();
            distance.Initialize();
            levelInfo.Initialize();
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