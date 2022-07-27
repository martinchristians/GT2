using UnityEngine;
using TMPro;

namespace UI.Ingame {

    public abstract class BoxWithTextUI : MonoBehaviour {
        
        [SerializeField] TextMeshProUGUI m_text;

        RectTransform rectTransform => (RectTransform)transform;

        protected virtual void ApplyText (string textToApply) {
            m_text.text = textToApply.ToString().Trim();
            m_text.ForceMeshUpdate(true);
            rectTransform.SetSizeWithCurrentAnchors(
                axis: RectTransform.Axis.Vertical,
                size: m_text.preferredHeight - m_text.rectTransform.sizeDelta.y
            );
        }

    }

}