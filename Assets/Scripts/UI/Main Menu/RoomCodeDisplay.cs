using UnityEngine;
using TMPro;

namespace UI.MainMenu {

    public class RoomCodeDisplay : MonoBehaviour {

        [SerializeField] TextMeshProUGUI m_textField;
        
        void Start () {
            if(SetRoomCode()){
                this.enabled = false;
            }else{
                m_textField.text = string.Empty;
            }
        }

        void Update () {
            if(SetRoomCode()){
                this.enabled = false;
            }
        }

        bool SetRoomCode () {
            if(Communication.GameClient.connected){
                m_textField.text = Communication.GameClient.roomCode;
                return true;
            }
            return false;
        }

    }

}