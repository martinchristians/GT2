using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
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
        [SerializeField] TextMeshProUGUI m_noStarsText;

        Image[] m_stars;

        void Awake () {
            if(instance != null){
                Debug.LogError("Singleton violation, yada yada...");
                Destroy(this.gameObject);
                return;
            }
            instance = this;
            m_stars = m_starParent.GetComponentsInChildren<Image>();    // fuck it. yes three stars is the maximum and i just put three star images here instead of spawning them and doing proper dynamic layouting. fight me. 
        }

        void _Show (Level.SaveData levelSaveData) {
            for(int i=0; i<m_stars.Length; i++){
                m_stars[i].color = (i < levelSaveData.starRating) ? Color.white : Color.black;  
            }
            m_noStarsText.gameObject.SetActive(levelSaveData.starRating < 1);
            var sb = new System.Text.StringBuilder();
            sb.AppendLine($"You survived for {levelSaveData.playDuration:F1} seconds");
            sb.AppendLine($"You covered a distance of {levelSaveData.distanceCovered:F1} meters");
            // TODO hidden medal counter? "you were awarded x medals" ?
            sb.AppendLine($"And you collected {levelSaveData.coinsCollected} coins on the way!");
            m_infoText.text = sb.ToString();
        }

    }

}