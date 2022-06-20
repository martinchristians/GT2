<script lang="ts">
  import type { GameMessage, ServerMessage } from '../../server/src/messages'
  import type { Player } from '../../server/src/room'
  import Join, { JoinEvent } from './views/join.svelte'

  let view = 'join'
  let paused = false
  let players: {
    id: number
    name: string
  }[] = []

  let socket: WebSocket | null = null
  let error: string | null = null

  function join(e: JoinEvent) {
    error = null
    const { roomCode, playerName } = e.detail
    // create new url with search params
    const host = 'ws://localhost:3000'
    const url = new URL(`${host}/joinGame`)
    url.searchParams.set('room', roomCode)
    url.searchParams.set('name', playerName)
    socket = new WebSocket(url)

    socket.addEventListener('error', () => {
      error = 'Failed to connect with server.'
    })
    socket.addEventListener('open', () => {
      view = 'lobby'
    })
    socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data)
      handleMessage(data)
    })
  }

  function handleMessage(msg: ServerMessage | GameMessage) {
    if (msg.type === 'list_players') {
      players = msg.players
    }
  }
</script>

{#if view === 'join'}
  <Join on:join={join} />
{/if}

{#if view === 'lobby'}
  <div>Players</div>
  <ul>
    {#each players as player}
      <li>{player.name}</li>
    {/each}
  </ul>
{/if}

<style lang="sass">
  div
    flex-direction: column
    margin: 32px
    display: flex
    gap: 16px
</style>
