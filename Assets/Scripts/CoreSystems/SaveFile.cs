using System.Collections.Generic;
using UnityEngine;

namespace CoreSystems {

    [System.Serializable]
    public class SaveFile {

#if UNITY_EDITOR

        [UnityEditor.MenuItem("Custom/Show Save File")]
        private static void _ShowSaveFile () {
            System.Diagnostics.Process.Start(Application.persistentDataPath);
        }

        [UnityEditor.MenuItem("Custom/Check Save File exists")]
        private static void _CheckSaveFileExistence () {
            if(ExistsOnDisk()){
                Debug.Log("Yup, it exists");
            }else{
                Debug.Log("Nope, no save file on disk!");
            }
        }

#endif

        private static SaveFile _instance;
        private static SaveFile instance {
            get {
                if(_instance == null){
                    Reset();
                }
                return _instance;
            }
            set {
                _instance = value;
            }
        }

        private static string saveFilePath => $"{Application.persistentDataPath}/saveFile";

        public static bool ExistsOnDisk () {
            return System.IO.File.Exists(saveFilePath);
        }

        public static void ReadFromDisk () {
            if(!ExistsOnDisk()){
                Debug.LogWarning("No save file exists on disk, resetting!");
                Reset();
                return;
            }
            var json = System.IO.File.ReadAllText(
                path: saveFilePath,
                encoding: System.Text.Encoding.UTF8
            );
            instance = JsonUtility.FromJson<SaveFile>(json);
        }

        public static void WriteToDisk () {
            System.IO.File.WriteAllText(
                path: saveFilePath,
                contents: JsonUtility.ToJson(instance, false),
                encoding: System.Text.Encoding.UTF8
            );
        }

        public static void Reset () {
            instance = new SaveFile();
            instance.m_levelSaveDatas = new List<Level.SaveData>();
        }
        
        [SerializeField] int m_totalCoinsCollected;
        [SerializeField] System.TimeSpan m_totalPlayTime;
        [SerializeField] List<Level.SaveData> m_levelSaveDatas; 

        public static void IncreaseCoinCounter (int coins) {
            instance.m_totalCoinsCollected += Mathf.Max(0, coins);
        }

        public static void IncreaseTotalPlayTime (System.TimeSpan timeSpan) {
            instance.m_totalPlayTime += timeSpan;
        }

        public static void SetLevelSaveData (Level.SaveData levelData) {
            for(int i=0; i<instance.m_levelSaveDatas.Count; i++){
                if(instance.m_levelSaveDatas[i].levelName == levelData.levelName){
                    instance.m_levelSaveDatas[i] = levelData;
                    return;
                }
            }
            instance.m_levelSaveDatas.Add(levelData);
        }

        public static int GetTotalCoinsCollected () => instance.m_totalCoinsCollected;

        public static System.TimeSpan GetTotalPlayTime () => instance.m_totalPlayTime;

        public static bool TryGetLevelSaveData (string levelName, out Level.SaveData output) {
            if(instance.m_levelSaveDatas != null){
                foreach(var levelSaveData in instance.m_levelSaveDatas){
                    if(levelSaveData.levelName == levelName){
                        output = levelSaveData;
                        return true;
                    }
                }
            }
            output = default;
            return false;
        }

    }

}