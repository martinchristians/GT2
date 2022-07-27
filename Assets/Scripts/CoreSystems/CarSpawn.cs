using UnityEngine;
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.SceneManagement;
#endif

namespace CoreSystems {

    public class CarSpawn : MonoBehaviour {

        public static CarSpawn current { get; private set; }

        bool m_carSpawned = false;
        
        void Awake () {
            current = this;
        }

        public CarController SpawnCar () {
            if(m_carSpawned){
                Debug.LogWarning("Car already spawned, aborting call!");
                return null;
            }
            var spawnedGO = Instantiate(GameConfig.instance.carPrefab, this.transform.position, this.transform.rotation);
            m_carSpawned = true;
            return spawnedGO.GetComponentInChildren<CarController>();
        }

        void OnDrawGizmos () {
            Gizmos.DrawIcon(transform.position + new Vector3(0, 0.5f, 0), "carSpawn.png", true);
            Gizmos.color = Color.white;
            var fwdPos = transform.position + transform.forward;
            Gizmos.DrawLine(transform.position, fwdPos);
            Gizmos.DrawLine(fwdPos, fwdPos - 0.167f * (2 * transform.forward + transform.right));
            Gizmos.DrawLine(fwdPos, fwdPos - 0.167f * (2 * transform.forward - transform.right));
        }

    #if UNITY_EDITOR

        [MenuItem("GameObject/Car Spawn", false, 10)]
        public static void CreateSpawnPoint () {
            var currentScene = EditorSceneManager.GetActiveScene();
            var newCarSpawn = ObjectFactory.CreateGameObject(currentScene, HideFlags.None, "Car Spawn", typeof(CarSpawn));
            Selection.activeGameObject = newCarSpawn;
            SceneView.lastActiveSceneView.FrameSelected();
        }

    #endif

    }

}