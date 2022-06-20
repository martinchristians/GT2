// Don't forget to run 'npm run json-schema' after changing this file!

export type ServerMessage =
  | {
      type: 'room_created'
      room_code: string
    }
  | {
      type: 'player_joined'
      id: number
      name: string
    }
  | {
      type: 'player_left'
      id: number
    }
  | {
      type: 'game_disconnected'
    }
  | {
      type: 'list_players'
      players: {
        id: number
        name: string
      }[]
    }
  | {
      type: 'invalid_message'
      code: string
      message: string
    }

export type ClientMessage =
  | {
      type: 'request_pause'
      pause: boolean
    }
  | {
      type: 'button_pressed'
      button: string
      pressed: boolean
    }

export type GameMessage = {
  recepient?: number
} & (
  | {
      type: 'game_paused'
      paused: boolean
    }
  | {
      type: 'enable_button'
      button: string
      enabled: boolean
    }
)
