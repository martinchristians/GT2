namespace UI.Ingame {

    public class LevelInfoUI : BoxWithTextUI {

        string m_levelInfo;
        
        public void Initialize () {
            if(Level.current == null){
                ApplyText("No Level!");
            }else{
                m_levelInfo = $"<u>Level Info</u>\n{Level.current.GetInfoAsString()}";
                Level.current.onCoinCollected += GoldChanged;
                GoldChanged();
            }
        }

        void GoldChanged () {
            ApplyText($"<b>{Level.current.currentCoinsCollected} Coins</b>\n\n{m_levelInfo}");
        }

    }

}