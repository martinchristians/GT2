using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Linq;
using UnityEngine;

namespace Communication {

    public static class GameClient {

#if UNITY_EDITOR

        const string USE_SERVER_KEY = "useRemoteServer";
        const bool USE_SERVER_BY_DEFAULT = false;

        [UnityEditor.MenuItem("Custom/Server/Remote")]
        static void EnableRemoteServer () => UnityEditor.EditorPrefs.SetBool(USE_SERVER_KEY, true);

        [UnityEditor.MenuItem("Custom/Server/Remote", true)]
        static bool EnableRemoteServerEnabled () => !UnityEditor.EditorPrefs.GetBool(USE_SERVER_KEY, USE_SERVER_BY_DEFAULT);

        [UnityEditor.MenuItem("Custom/Server/Localhost")]
        static void DisableRemoteServer () => UnityEditor.EditorPrefs.SetBool(USE_SERVER_KEY, false);

        [UnityEditor.MenuItem("Custom/Server/Localhost", true)]
        static bool DisableRemoteServerEnabled () => UnityEditor.EditorPrefs.GetBool(USE_SERVER_KEY, USE_SERVER_BY_DEFAULT);

#else

        const string USE_LOCAL_SERVER_PARAM = "useLocalServer";

#endif

        const string LOCAL_SERVER_ADDRESS = "ws://127.0.0.1:3000/createGame";
        const string REMOTE_SERVER_ADDRESS = "wss://game.jwels.berlin/api/createGame";

        public static event System.Action<string> onRoomCodeGenerated = delegate {};
        public static event System.Action<PlayerData> onTutorialRequested = delegate {};
        public static event System.Action<int> onLevelStartRequested = delegate {};
        public static event System.Action<PlayerData> onMainMenuRequested = delegate {};
        public static event System.Action<PlayerData> onPlayerJoined = delegate {};
        public static event System.Action<PlayerData> onPlayerLeft = delegate {};
        public static event System.Action onPlayersChanged = delegate {};

        public static event System.Action<PlayerData> onPauseRequested = delegate {};
        public static event System.Action<PlayerData> onUnpauseRequested = delegate {};

        public static string roomCode { get; private set; }
        public static bool connected => !string.IsNullOrWhiteSpace(roomCode);

        public static bool ButtonIsPressed (string button) {
            buttonStateHasUnqueriedUpdates[button] = false;
            if(buttonPressed.TryGetValue(button, out var output)){
                return output;
            }
            return false;
        }

        public static bool ButtonWasPressedSinceLastQuery (string button) {
            if(!buttonStateHasUnqueriedUpdates[button]) return false;
            return ButtonIsPressed(button);
        }

        public static void ResetButtonsPressed () {
            buttonPressed.Clear();
            buttonStateHasUnqueriedUpdates.Clear();
            foreach(var button in Button.all){
                buttonPressed[button] = false;
                buttonStateHasUnqueriedUpdates[button] = false;
            }
        }

        private static ClientWebSocket socket;
        private static Dictionary<string, bool> buttonPressed = new Dictionary<string, bool>();
        private static Dictionary<string, bool> buttonStateHasUnqueriedUpdates = new Dictionary<string, bool>();

        private static List<PlayerData> _connectedPlayers = new List<PlayerData>();
        public static IReadOnlyList<PlayerData> connectedPlayers => _connectedPlayers;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static async void CreateClient () {
            ResetButtonsPressed();
#if UNITY_EDITOR
            onRoomCodeGenerated += (rc) => {
                UnityEditor.EditorGUIUtility.systemCopyBuffer = rc;
                UnityEngine.Debug.Log($"Room code \"{rc}\" written to copy-buffer");
            };
#endif
            try{
                socket = new ClientWebSocket();
                string serverAddress;
#if UNITY_EDITOR
                if(UnityEditor.EditorPrefs.GetBool(USE_SERVER_KEY, USE_SERVER_BY_DEFAULT)){
                    serverAddress = REMOTE_SERVER_ADDRESS;
                }else{
                    serverAddress = LOCAL_SERVER_ADDRESS;
                }
#else
                if(System.Environment.GetCommandLineArgs().Any((arg) => arg.Trim().Equals(USE_LOCAL_SERVER_PARAM))){
                    serverAddress = LOCAL_SERVER_ADDRESS;
                }else{
                    serverAddress = REMOTE_SERVER_ADDRESS;
                }
#endif
                Debug.Log($"attempting to connect to \"{serverAddress}\"");
                await socket.ConnectAsync(new System.Uri(serverAddress), CancellationToken.None);
                switch(socket.State){
                    case WebSocketState.Open:
                        Application.quitting += socket.Abort;
                        RunClient(socket);
                        break;
                    default:
                        Debug.LogError($"Connection not open, was {socket.State}. Aborting!");
                        socket.Abort();
                        break;
                }
            }catch(System.Exception e){
                Debug.LogException(e);
            }
        }

        static async void RunClient (ClientWebSocket socket) {
            while(socket.State == WebSocketState.Open){
                var bytes = new System.ArraySegment<byte>(new byte[1024]);
                var result = await socket.ReceiveAsync(bytes, CancellationToken.None);
                var receivedText = System.Text.Encoding.UTF8.GetString(bytes.Array, 0, result.Count);
                var data = JsonUtility.FromJson<ServerOrClientMessage>(receivedText);
                // Debug.Log($"received message \"{data.type}\"\n{receivedText}");
                switch(data.type){
                    case "room_created":
                        roomCode = data.room_code;
                        onRoomCodeGenerated(roomCode);
                        break;
                    case "start_level":
                        switch(data.level){
                            case CoreSystems.GameManager.TUTORIAL_SCENE_INDEX:
                                onTutorialRequested(_connectedPlayers.Single((pd) => pd.id == data.from));
                                break;
                            default:
                                onLevelStartRequested(data.level);
                                break;
                        }
                        break;
                    case "return_to_menu":
                        onMainMenuRequested(connectedPlayers.Single((pd) => pd.id == data.from));
                        break;
                    case "button_pressed":
                        buttonPressed[data.button] = data.pressed;
                        buttonStateHasUnqueriedUpdates[data.button] = true;
                        break;
                    case "player_joined":
                        var newPlayer = new PlayerData(){
                            id = data.id,
                            name = data.name
                        };
                        _connectedPlayers.Add(newPlayer);
                        onPlayerJoined(newPlayer);
                        onPlayersChanged();
                        break;
                    case "player_left":
                        var removeIndex = _connectedPlayers.FindIndex((pd) => pd.id == data.id);
                        var removedPlayer = _connectedPlayers[removeIndex];
                        _connectedPlayers.RemoveAt(removeIndex);
                        onPlayerLeft(removedPlayer);
                        onPlayersChanged();
                        break;
                    case "request_pause":
                        if(data.pause){
                            onPauseRequested(connectedPlayers.Single((pd) => pd.id == data.from));
                        }else{
                            onUnpauseRequested(connectedPlayers.Single((pd) => pd.id == data.from));
                        }
                        break;
                    default:
                        Debug.LogWarning($"Unimplemented server message type \"{data.type}\". Raw message:\n{receivedText}");
                        break;
                }
            }
            throw new System.Exception("The socket is no longer open! I was using that!");
        }

        private static System.Threading.Tasks.Task SendMessage (string message) {
            return socket.SendAsync(
                buffer: new System.ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(message)),
                messageType: WebSocketMessageType.Text,
                endOfMessage: true,
                cancellationToken: CancellationToken.None
            );
        }

        public static async void UpdatePauseState (int playerId, bool value) {
            await SendMessage(JsonUtility.ToJson(new BroadcastGameMessage(){
                type = "set_paused",
                paused = value,
                player = playerId
            }));
        }

        public static async void SendButtonsEnabled (int playerId, IEnumerable<string> buttonIds, bool value) {
            await SendMessage(JsonUtility.ToJson(new TargetedGameMessage(){
                recipient = playerId,
                type = "set_buttons",
                buttons = new List<string>(buttonIds).ToArray(),
                enabled = value
            }));
        }

        public static async void SendMainMenuOpened () {
            await SendMessage(JsonUtility.ToJson(new BroadcastGameMessage(){
                type = "main_menu_opened"
            }));
        }

        public static void SendLevelStarted (GamepadLayout layout) {
            SendLevelStarted(-1, layout);
        }

        public static async void SendLevelStarted (int playerId, GamepadLayout layout) {
            if(playerId < 0){
                await SendMessage(JsonUtility.ToJson(new BroadcastGameMessage(){
                    type = "level_started",
                    layout = "default"
                }));
            }else{
                await SendMessage(JsonUtility.ToJson(new TargetedGameMessage(){
                    recipient = playerId,
                    type = "level_started",
                    layout = "default"
                }));
            }
        }

    }

}