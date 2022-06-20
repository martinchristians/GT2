using UnityEngine;
using Communication;

public class TempRoomCodeDisplay : MonoBehaviour {

    // probably make something fancier, with a nice canvas and stuff.
    
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
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
