using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

namespace UI.MainMenu {

    public class LevelsDisplay : MonoBehaviour {

        [SerializeField] TextMeshProUGUI m_textField;

        // TODO idea: i make the framework for savedata. then all people have to do is call "SaveData.RegisterLevelFinished(System.TimeSpan clearDuration, Medal grade)"
        // TODO if clear data is shown here, also add a "reset savedata" button
        
        void Start () {
            // var sb = new System.Text.StringBuilder();
            // sb.AppendLine("// TODO do we show clear times and medals here?");
            // for(int i=1; i<SceneManager.sceneCountInBuildSettings; i++){
            //     var scenePath = SceneUtility.GetScenePathByBuildIndex(i);
            //     var sceneName = System.IO.Path.GetFileNameWithoutExtension(scenePath);
            //     sb.AppendLine($"Level {i}: {sceneName}");
            // }
            // m_textField.text = sb.ToString();
            var playTime = CoreSystems.SaveFile.GetTotalPlayTime();
            m_textField.text = $"Total playtime: {Mathf.FloorToInt((float)(playTime.TotalMinutes))}min {playTime.Seconds:F1}sec\nTotal coins collected: {CoreSystems.SaveFile.GetTotalCoinsCollected()}";
        }

    }

}