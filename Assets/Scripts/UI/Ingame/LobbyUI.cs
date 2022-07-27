using System.Collections.Generic;

namespace UI.Ingame {

    public class LobbyUI : BoxWithTextUI {

        System.Text.StringBuilder m_sb;
        
        void Start () {
            m_sb = new System.Text.StringBuilder();
            if(!Communication.GameClient.connected){
                m_sb.AppendLine("Offline");
                this.enabled = false;
            }else{
                UpdateStringbuilderText();
            }
            ApplyStringbuilderText();
        }

        void Update () {
            UpdateStringbuilderText();
            ApplyStringbuilderText();
        }

        void UpdateStringbuilderText () {
            m_sb.Clear();
            if(CoreSystems.GameManager.players.Count > 0){
                AppendPlayerList("Players", CoreSystems.GameManager.players);
                if(CoreSystems.GameManager.spectators.Count > 0){
                    m_sb.AppendLine();
                }
            }
            if(CoreSystems.GameManager.spectators.Count > 0){
                AppendPlayerList("Spectators", CoreSystems.GameManager.spectators);
            }

            void AppendPlayerList (string title, IEnumerable<Communication.PlayerData> players) {
                m_sb.AppendLine($"<u>{title}</u>");
                foreach(var player in players){
                    m_sb.AppendLine($"   {player.name}");
                }
            }
        }

        void ApplyStringbuilderText () {
            ApplyText(m_sb.ToString());
        }

    }

}