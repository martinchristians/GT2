using System.Collections;
using UnityEngine;
using TMPro;

namespace UI.Ingame {

    public class CountdownUI : MonoBehaviour {

        [SerializeField] CanvasGroup m_canvasGroup;
        [SerializeField] TextMeshProUGUI m_text;

        private Coroutine m_current;

        public void DoCountdown (System.Action onFinished) {
            if(m_current != null) StopCoroutine(m_current);
            m_current = StartCoroutine(ExecuteCountdown());

            IEnumerator ExecuteCountdown () {
                this.gameObject.SetActive(true);
                m_canvasGroup.enabled = true;
                m_canvasGroup.alpha = 1;
                var t = 3f;
                while(t > 0){
                    m_text.text = Mathf.Ceil(t).ToString();
                    m_text.transform.localScale = Vector3.one * (1f + (0.333f * Mathf.Repeat(t, 1)));
                    yield return null;
                    t -= Time.deltaTime;
                }
                onFinished();
                m_text.text = "GO!";
                t = 1f;
                while(t > 0){
                    m_text.transform.localScale = Vector3.one * (1f + (0.333f * Mathf.Repeat(t, 1)));
                    m_canvasGroup.alpha = t;
                    yield return null;
                    t -= Time.deltaTime;
                }
                m_canvasGroup.enabled = false;
                this.gameObject.SetActive(false);
            }
        }

    }

}