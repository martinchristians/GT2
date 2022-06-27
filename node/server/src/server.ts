import { Server, WebSocket } from 'ws'
import { createServer, Server as HttpServer } from 'http'
import { RoomManager } from './room-manager'
import { RoomWebSocket } from './room'

export default class {
  httpServer: HttpServer
  websocketServer: Server<WebSocket>
  roomManager: RoomManager

  constructor() {
    this.roomManager = new RoomManager()
    this.httpServer = createServer()
    this.websocketServer = new Server({
      noServer: true,
    })

    this.httpServer.on('upgrade', (request, socket, head) => {
      if (!request.url) {
        socket.destroy()
        return
      }

      const { pathname, searchParams } = new URL(
        request.url,
        'http://localhost',
      )

      if (pathname === '/createGame') {
        this.websocketServer.handleUpgrade(request, socket, head, (socket) => {
          this.roomManager.createRoom(socket)
        })
        return
      }

      if (pathname === '/joinGame') {
        const roomCode = searchParams.get('room')
        const playerName = searchParams.get('name')

        if (
          !roomCode ||
          !playerName ||
          playerName.length > 20 ||
          playerName.length < 2
        ) {
          socket.destroy()
          return
        }

        const room = this.roomManager.getRoom(roomCode.toUpperCase())
        if (!room) {
          socket.destroy()
          return
        }
        this.websocketServer.handleUpgrade(request, socket, head, (socket) => {
          room.addPlayer(socket as RoomWebSocket, playerName)
        })
        return
      }
      socket.destroy()
    })
  }

  start() {
    this.httpServer.listen(3000, () => {
      console.log(`🔥 HTTP Server running on port ${3000}...`)
    })
  }

  stop() {
    this.websocketServer.close(() => {
      this.httpServer.close()
    })
  }
}
