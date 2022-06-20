using System.Net.WebSockets;
using System.Threading;
using UnityEngine;

namespace Communication {

    public static class GameClient {

        public static event System.Action<string> onRoomCodeGenerated = delegate {};

        public static string roomCode { get; private set; }

        private static ClientWebSocket socket;

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

        static async void RunClient (ClientWebSocket socket) {
            while(socket.State == WebSocketState.Open){
                var bytes = new System.ArraySegment<byte>(new byte[1024]);
                var result = await socket.ReceiveAsync(bytes, CancellationToken.None);
                var receivedText = System.Text.Encoding.UTF8.GetString(bytes.Array, 0, result.Count);
                var data = JsonUtility.FromJson<ServerMessage>(receivedText);
                switch(data.type){
                    case "room_created":
                        roomCode = data.room_code;
                        onRoomCodeGenerated(roomCode);
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
                type = "game_paused",
                paused = value
            }));
        }

        public static async void SendButtonEnabled (string buttonId, bool value) {
            await SendMessage(JsonUtility.ToJson(new GameMessage(){
                type = "enable_button",
                button = buttonId,  // TODO maybe use an enum or something for this. 
                enabled = value
            }));
        }

    }

}