using UnityEngine;
using TMPro;

namespace UI.MainMenu {

    public class PlayerDisplay : MonoBehaviour {

        [SerializeField] TextMeshProUGUI m_textField;
        [SerializeField] string m_spacerInsert;
        
        void Start () {
            m_textField.text = string.Empty;
        }

        void Update () {
            if(Communication.GameClient.connected){
                var sb = new System.Text.StringBuilder();
                foreach(var player in Communication.GameClient.connectedPlayers){
                    sb.AppendLine(player.name);
                    sb.AppendLine(m_spacerInsert);
                }
                var newText = sb.ToString();
                m_textField.text = sb.ToString();
            }
        }

    }

}