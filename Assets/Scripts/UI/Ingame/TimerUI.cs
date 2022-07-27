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
            var secondsRaw = m_level.displayTime - (60 * minutes);
            var secondsInt = Mathf.FloorToInt(secondsRaw);
            var secondsRemainder = Mathf.Repeat(secondsRaw, 1);
            m_text.text = $"{minutes:D2}:{secondsInt:D2}.{secondsRemainder.ToString("F2").Substring(2)}";
        }

    }

}