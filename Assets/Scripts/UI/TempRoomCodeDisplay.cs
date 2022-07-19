using UnityEngine;
using Communication;

namespace UI {

    public class TempRoomCodeDisplay : MonoBehaviour {

        // do we keep this for showing the room code when we're in a level? probably not, but in case, imma keep it. long complicated script and all that...
        
        // [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void CreateInstance () {
            var newGO = new GameObject($"[{nameof(TempRoomCodeDisplay)}]", typeof(TempRoomCodeDisplay));
            DontDestroyOnLoad(newGO);
        }

        void OnGUI () {
            if(!string.IsNullOrWhiteSpace(GameClient.roomCode)){
                GUILayout.Box($"Room Code: {GameClient.roomCode}");
            }
        }

    }

}