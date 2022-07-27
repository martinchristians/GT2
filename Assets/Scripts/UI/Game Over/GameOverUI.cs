using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace UI.GameOver {

    public class GameOverUI : MonoBehaviour {

        private static GameOverUI instance;

        public static void EnsureExists () {
            if(instance == null){
                DontDestroyOnLoad(Instantiate(CoreSystems.GameConfig.instance.gameOverUiPrefab));
            }
        }

        public static void Show (Level.SaveData levelSaveData) {
            instance.gameObject.SetActive(true);
            instance._Show(levelSaveData);
        }

        public static void Hide () {
            instance.gameObject.SetActive(false);
        }

        [SerializeField] RectTransform m_starParent;
        [SerializeField] TextMeshProUGUI m_infoText;

        void Awake () {
            if(instance != null){
                Debug.LogError("Singleton violation, yada yada...");
                Destroy(this.gameObject);
                return;
            }
            instance = this;
        }

        void _Show (Level.SaveData levelSaveData) {
            for(int i=0; i<m_starParent.childCount; i++){
                m_starParent.GetChild(i).gameObject.SetActive(i < levelSaveData.starRating);    // fuck it. yes three stars is the maximum and i just put three star images here instead of spawning them and doing proper dynamic layouting. fight me. 
            }
            var sb = new System.Text.StringBuilder();
            sb.AppendLine($"You survived for {levelSaveData.playDuration:F1} seconds");
            sb.AppendLine($"You covered a distance of {levelSaveData.distanceCovered:F1} meters");
            // TODO hidden medal counter? "you were awarded x medals" ?
            sb.AppendLine($"And you collected {levelSaveData.coinsCollected} coins on the way!");
            m_infoText.text = sb.ToString();
        }

    }

}