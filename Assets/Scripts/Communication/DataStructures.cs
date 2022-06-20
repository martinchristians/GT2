using UnityEngine;

namespace Communication {

    [System.Serializable]
    struct GameMessage {
        [SerializeField] public string type;
        [SerializeField] public bool paused;
        [SerializeField] public string button;
        [SerializeField] public bool enabled;
    }

    [System.Serializable]
    struct ServerMessage {
        [SerializeField] public string type;
        [SerializeField] public string room_code;
        [SerializeField] public int id;
        [SerializeField] public string name;
        [SerializeField] public string code;
        [SerializeField] public string message;
        [SerializeField] public PlayerData[] players;
    }

    [System.Serializable]
    struct PlayerData {
        [SerializeField] public int id;
        [SerializeField] public string name;
    }

}