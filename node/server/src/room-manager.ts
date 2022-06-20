import { WebSocket } from 'ws'
import Hashids from 'hashids'
import * as utils from './utils'
import Room, { RoomWebSocket } from './room'

const hashids = new Hashids()

export const SERVER_ID = undefined
export const GAME_ID = -1

export class RoomManager {
  rooms: { [key: string]: Room } = {}

  createRoom(game: WebSocket): string {
    const roomCode = this.generateRoomCode()
    const room = new Room(roomCode, game as RoomWebSocket)
    this.rooms[roomCode] = room
    room.msgGame({ type: 'room_created', room_code: roomCode }, SERVER_ID)
    game.on('close', () => {
      room.msgAllPlayers({ type: 'game_disconnected' }, SERVER_ID)
      room.closeRoom()
      delete this.rooms[roomCode]
    })
    return roomCode
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms[roomCode]
  }

  generateRoomCode(): string {
    // generate a random room id until we find one that doesn't exist
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const roomCode = hashids.encode(utils.getRandomIntInclusive(100, 10000))
      if (!this.rooms[roomCode]) {
        return roomCode
      }
    }
  }
}
