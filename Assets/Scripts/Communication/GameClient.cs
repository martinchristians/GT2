using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using UnityEngine;

namespace Communication {

    public static class GameClient {

        public static event System.Action<string> onRoomCodeGenerated = delegate {};
        public static event System.Action<int> onLevelStartRequested = delegate {};
        public static event System.Action onMainMenuRequested = delegate {};

        public static string roomCode { get; private set; }

        public static bool ButtonIsPressed (string button) {
            return buttonPressed[button];
        }

        public static void ResetButtonsPressed () {
            buttonPressed = buttonPressed ?? new Dictionary<string, bool>();
            buttonPressed.Clear();
            foreach(var button in Button.all){
                buttonPressed[button] = false;
            }
        }

        private static ClientWebSocket socket;
        private static Dictionary<string, bool> buttonPressed;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static async void CreateClient () {
            try{
                socket = new ClientWebSocket();
                await socket.ConnectAsync(new System.Uri("ws://127.0.0.1:3000/createGame"), CancellationToken.None);
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

        // TODO track players. if in a level and player leaves with no players left, go back to main menu

        static async void RunClient (ClientWebSocket socket) {
            ResetButtonsPressed();
            while(socket.State == WebSocketState.Open){
                var bytes = new System.ArraySegment<byte>(new byte[1024]);
                var result = await socket.ReceiveAsync(bytes, CancellationToken.None);
                var receivedText = System.Text.Encoding.UTF8.GetString(bytes.Array, 0, result.Count);
                var data = JsonUtility.FromJson<ServerOrClientMessage>(receivedText);
                switch(data.type){
                    case "room_created":
                        roomCode = data.room_code;
                        onRoomCodeGenerated(roomCode);
                        break;
                    case "start_level":
                        onLevelStartRequested(data.level);
                        break;
                    case "return_to_menu":
                        onMainMenuRequested();
                        break;
                    case "button_pressed":
                        buttonPressed[data.button] = data.pressed;
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

        public static async void UpdatePauseState (bool value) {
            await SendMessage(JsonUtility.ToJson(new GameMessage(){
                type = "set_paused",
                paused = value
            }));
        }

        public static async void SendButtonsEnabled (string[] buttonIds, bool value) {
            await SendMessage(JsonUtility.ToJson(new GameMessage(){
                type = "set_buttons",
                buttons = buttonIds,  // TODO maybe use an enum or something for this. 
                enabled = value
            }));
        }

        public static async void SendMainMenuOpened () {
            await SendMessage(JsonUtility.ToJson(new GameMessage(){
                type = "main_menu_opened"
            }));
        }

        public static async void SendLevelStarted () {
            await SendMessage(JsonUtility.ToJson(new GameMessage(){
                type = "level_started",
                layout = "default"  // TODO gamepadlayout?
            }));
        }

    }

}