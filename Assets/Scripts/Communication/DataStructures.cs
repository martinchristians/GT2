using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Communication {

    [System.Serializable]
    struct BroadcastGameMessage {

        [SerializeField] public int player;
        [SerializeField] public string type;
        [SerializeField] public bool paused;
        [SerializeField] public string[] buttons;
        [SerializeField] public bool enabled;
        [SerializeField] public string layout;
        
    }

    [System.Serializable]
    struct TargetedGameMessage {

        [SerializeField] public int player;
        [SerializeField] public int recipient;
        [SerializeField] public string type;
        [SerializeField] public bool paused;
        [SerializeField] public string[] buttons;
        [SerializeField] public bool enabled;
        [SerializeField] public string layout;
        
    }

    [System.Serializable]
    struct ServerOrClientMessage {

        [SerializeField] public string type;
        [SerializeField] public string room_code;
        [SerializeField] public int id;
        [SerializeField] public string name;
        [SerializeField] public string code;
        [SerializeField] public string message;
        [SerializeField] public PlayerData[] players;
        [SerializeField] public bool pause;
        [SerializeField] public int level;
        [SerializeField] public string button;
        [SerializeField] public bool pressed;
        [SerializeField] public int from;

    }

    [System.Serializable]
    public struct PlayerData {

        [SerializeField] public int id;
        [SerializeField] public string name;

        public override bool Equals (object obj) {
            if(obj is PlayerData otherPlayerData){
                return otherPlayerData.id == this.id;
            }
            return false;
        }

        public override int GetHashCode () {
            return id;
        }

        public override string ToString () {
            return JsonUtility.ToJson(this, true);
        }

    }

    public static class Button {

        public const string left = "left";
        public const string right = "right";
        public const string forward = "go";
        public const string back = "stop";
        public const string jump = "jump";

        public static IEnumerable<string> all { get {
            yield return left;
            yield return right;
            yield return forward;
            yield return back;
            yield return jump;
        } }

        public static IEnumerable<string> GetOpposite (IEnumerable<string> inputButtons) {
            foreach(var button in all){
                if(!inputButtons.Contains(button)){
                    yield return button;
                }
            }
        }

    }

    public class GamepadLayout {

        public static readonly GamepadLayout standard = new GamepadLayout("default");
        public static readonly GamepadLayout jump = new GamepadLayout("jump");

        private readonly string layoutId;

        private GamepadLayout (string layoutId) {
            this.layoutId = layoutId;
        }

        public override string ToString () {
            return layoutId;
        }

    }

}