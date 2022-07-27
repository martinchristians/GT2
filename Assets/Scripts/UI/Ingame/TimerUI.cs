using UnityEngine;
using TMPro;

namespace UI.Ingame {

    public class TimerUI : MonoBehaviour {

        [SerializeField] TextMeshProUGUI m_text;

        Level m_level;

        public void Initialize () {
            m_level = Level.current;
            this.enabled = m_level != null;
        }

        void Update () {
            var minutes = Mathf.FloorToInt(m_level.displayTime) / 60;
            var seconds = m_level.displayTime - (60 * minutes);
            m_text.text = $"{minutes}:{seconds:F2}";
        }

    }

}