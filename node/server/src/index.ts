import Server from './server'

const server = new Server()

process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true }))
process.on('SIGUSR1', handleExit.bind(null, { exit: true }))
process.on('SIGUSR2', handleExit.bind(null, { exit: true }))
process.on('uncaughtException', handleExit.bind(null, { exit: true }))

function handleExit(options: any) {
  if (options.cleanup) {
    server.stop()
    console.log('👋 Bye!')
    process.exit()
  }
  if (options.exit) {
    process.exit()
  }
}

;(() => {
  console.log('👋 Starting server...')
  server.start()
})()
