// This is a generated file. Do not edit. Look at server/src/messages.ts for the source.

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
      players: Player[]
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
      type: 'return_to_menu'
    }
  | {
      type: 'start_level'
      level: number
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
      type: 'set_paused'
      paused: boolean
    }
  | {
      type: 'level_started'
      layout: 'default' | GamepadLayout
    }
  | {
      type: 'main_menu_opened'
    }
  | {
      type: 'set_buttons'
      buttons: string[]
      enabled: boolean
    }
)

// ----- subtypes -----
// when writing messages in JSON, enum values just use the string value

export interface Player {
  id: number
  name: string
}

export interface GamepadLayout {
  gridAreas: string[]
  gridColumns: string
  gridRows: string
  buttons: GamepadButton[]
}

export interface GamepadButton {
  name: string
  color: ButtonColor
  icon: ButtonIcon
}

export enum ButtonColor {
  Blue = 'blue',
  Neon = 'neon',
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
}

export enum ButtonIcon {
  Flip = 'flip',
  Go = 'go',
  Jump = 'jump',
  Left = 'left',
  Right = 'right',
  SignalLeft = 'signal-left',
  SignalRight = 'signal-right',
  Stop = 'stop',
}
