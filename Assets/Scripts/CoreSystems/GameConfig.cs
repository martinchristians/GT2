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

    }

}