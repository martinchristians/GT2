using System.Collections.Generic;
using Communication;
using Button = Communication.Button;

namespace CoreSystems {

    public static class IngameButtonLayout {

        private static readonly string[][][] playerCountMappings = new string[][][]{
                new string[][]{             // 1 player
                    new string[]{
                        Button.forward,
                        Button.back,
                        Button.left,
                        Button.right
                    }
                },
                new string[][]{             // 2 player
                    new string[]{
                        Button.forward,
                        Button.left
                    },
                    new string[]{
                        Button.back,
                        Button.right
                    }
                },
                new string[][]{             // 3 player
                    new string[]{
                        Button.forward,
                        Button.back
                    },
                    new string[]{
                        Button.left
                    },
                    new string[]{
                        Button.right
                    }
                },
                new string[][]{             // 4 player
                    new string[]{
                        Button.forward
                    },
                    new string[]{
                        Button.back
                    },
                    new string[]{
                        Button.left
                    },
                    new string[]{
                        Button.right
                    }
                }
            };

        public static void ApplyForPlayers (IReadOnlyList<PlayerData> players) {
            if(players.Count < 1){
                return;
            }
            var mapping = playerCountMappings[players.Count - 1];
            for(int i=0; i<players.Count; i++){
                var player = players[i];
                var playerButtons = mapping[i];
                GameClient.SendButtonsEnabled(player.id, playerButtons, true);
                GameClient.SendButtonsEnabled(player.id, Button.GetOpposite(playerButtons), false);
            }
        }

    }

}