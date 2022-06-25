import { RawData, Server, WebSocket } from 'ws'
import { createServer, Server as HttpServer } from 'http'
import Hashids from 'hashids'
import * as utils from './utils'
import { ClientMessage, GameMessage, ServerMessage } from './messages'
import { Schema, Validator } from 'jsonschema'
import { schemaClientMessage, schemaGameMessage } from './messages-schema'
import { GAME_ID, SERVER_ID } from './room-manager'

const v = new Validator()

export interface RoomWebSocket extends WebSocket {
  roomCode: string
  userId: number
}

export interface Player {
  socket: RoomWebSocket
  name: string
}

export default class Room {
  code: string
  game: RoomWebSocket
  players: (Player | undefined)[]

  constructor(code: string, game: RoomWebSocket) {
    this.code = code
    this.game = game
    this.players = []

    game.roomCode = code
    game.userId = 0

    game.on('message', (message, isBinary) =>
      this.handleServerMessage(message, isBinary),
    )
  }

  addPlayer(socket: RoomWebSocket, playerName: string) {
    let id = this.players.findIndex((player) => !player)
    if (id === -1) {
      id = this.players.length
    }
    socket.userId = id
    socket.roomCode = this.code
    this.players[id] = {
      socket,
      name: playerName,
    }
    this.msgEveryone({
      type: 'player_joined',
      id,
      name: playerName,
    })
    this.msgPlayer(
      id,
      {
        type: 'list_players',
        players: this.getPlayerList(),
      },
      SERVER_ID,
    )

    const reply = (code: string, error: string) => {
      this.msgPlayer(
        id,
        {
          type: 'invalid_message',
          code,
          message: error,
        },
        SERVER_ID,
      )
    }
    socket.on('message', (message, isBinary) =>
      this.handleClientMessage(id, message, isBinary),
    )
    socket.on('close', () => {
      this.msgEveryone({
        type: 'player_left',
        id,
      })
      this.players[id] = undefined
    })
    socket.on('error', (error) => {
      console.log(error)
    })
  }

  handleClientMessage(id: number, message: RawData, isBinary: boolean) {
    const reply = (code: string, error: string) => {
      console.log(`[Error for P${id}]`, { code, error })
      this.msgPlayer(
        id,
        {
          type: 'invalid_message',
          code,
          message: error,
        },
        SERVER_ID,
      )
    }

    if (isBinary) {
      reply('binary_data', 'Binary messages are not supported')
    }
    const msg = checkMsg(
      schemaClientMessage,
      message.toString(),
      reply,
    ) as ClientMessage | null
    console.log(`[Message from P${id}]`, msg)
    if (!msg) {
      return
    }
    this.msgGame(msg, id)
  }

  handleServerMessage(message: RawData, isBinary: boolean) {
    try {
      const reply = (code: string, error: string) => {
        console.log('[Error for Game]', { code, error })
        this.msgGame(
          {
            type: 'invalid_message',
            code,
            message: error,
          },
          SERVER_ID,
        )
      }
      if (isBinary) {
        reply('binary_data', 'Binary messages are not supported')
      }
      const msg = checkMsg(
        schemaGameMessage,
        message.toString(),
        reply,
      ) as GameMessage | null
      console.log(`[Message from game]`, msg)
      if (!msg) {
        return
      }
      if ('recepient' in msg && msg.recepient != undefined) {
        this.msgPlayer(msg.recepient, msg, GAME_ID)
      } else {
        this.msgAllPlayers(msg, GAME_ID)
      }
    } catch (error) {
      console.log(error)
    }
  }

  msgGame(msg: ServerMessage | ClientMessage, from: number | undefined) {
    this.game.send(
      JSON.stringify({
        ...msg,
        from,
      }),
    )
  }

  msgPlayer(
    id: number,
    msg: ServerMessage | GameMessage,
    from: number | undefined,
  ) {
    this.players[id]?.socket.send(
      JSON.stringify({
        ...msg,
        from,
      }),
    )
  }

  msgAllPlayers(msg: ServerMessage | GameMessage, from: number | undefined) {
    this.players.forEach((player) => {
      player?.socket.send(
        JSON.stringify({
          ...msg,
          from,
        }),
      )
    })
  }

  msgEveryone(msg: ServerMessage) {
    this.msgGame(msg, SERVER_ID)
    this.msgAllPlayers(msg, SERVER_ID)
  }

  getPlayerList(): { id: number; name: string }[] {
    return this.players.filter(utils.notUndefined).map((player, id) => ({
      id,
      name: player.name,
    }))
  }

  closeRoom() {
    console.log('[Room closed]')
    this.game.close()
    this.players.filter(utils.notUndefined).forEach((player) => {
      player.socket.close()
    })
  }
}

function checkMsg(
  schema: Schema,
  msg: string,
  reply: (code: string, error: string) => void,
): ClientMessage | ServerMessage | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(msg)
  } catch (e) {
    reply('invalid_json', 'Message contained invalid JSON.')
    return null
  }
  const result = v.validate(parsed, schema)
  if (!result.valid) {
    reply('invalid_schema', `Message had invalid schema: ${result.toString()}`)
    return null
  }
  return parsed as ClientMessage | ServerMessage
}
