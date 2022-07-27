using UnityEngine;

namespace CoreSystems {

    public class GameConfig : ScriptableObject {
        
        private static GameConfig _instance;
        public static GameConfig instance {
            get {
                if(_instance == null){
                    _instance = Resources.Load<GameConfig>("GameConfig");
                }
                return _instance;
            }
        }

        [field: SerializeField] public GameObject carPrefab { get; private set; }   // why is the "vehicle" component not on the top level?!?!?!
        [field: SerializeField] public UI.PauseMenu pauseMenuPrefab { get; private set; }
        [field: SerializeField] public UI.Ingame.GameUI gameUiPrefab { get; private set; }
        [field: SerializeField] public SFX sfxPrefab { get; private set; }
        [field: SerializeField] public UI.GameOver.GameOverUI gameOverUiPrefab { get; private set; }

    }

}