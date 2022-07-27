using UnityEngine;
using TMPro;

namespace UI.Ingame {

    public class DistanceUI : MonoBehaviour {

        [SerializeField] TextMeshProUGUI m_text;
        
        public void Initialize () {
            this.gameObject.SetActive(Level.current == null ? false : Level.current.mode == Level.Mode.GoFarWithCheckpoints);
        }

        void Update () {
            m_text.text = $"{Level.current.distanceTraveled:F1}m";
        }

    }

}