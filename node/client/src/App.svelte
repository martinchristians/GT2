<script lang="ts">
  import type { GameMessage, ServerMessage } from '../../server/src/messages'
  import ArcadeButton from './components/arcade-button.svelte'
  import GameHeader from './components/game-header.svelte'
  import Gamepad from './components/gamepad.svelte'
  import Join, { JoinEvent } from './views/join.svelte'

  let view = 'join'
  // let view = 'dd'
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
    const host = 'ws://0.0.0.0:3000'
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
    console.log(msg.type, msg)
    if (msg.type === 'list_players') {
      players = msg.players
    } else if (msg.type === 'player_joined') {
      players[msg.id] = {
        id: msg.id,
        name: msg.name,
      }
    } else if (msg.type === 'player_left') {
      players[msg.id] = undefined
    }
  }
</script>

<main>
  {#if view === 'join'}
    {#if error}
      <div class="error">{error}</div>
    {/if}
    <Join on:join={join} />
  {:else}
    <GameHeader />
    {/if}

  <!-- <Gamepad /> -->

  {#if view === 'lobby'}
    <div class="hbox grow">
  <section class="players grow scroll">
    <h2>Players</h2>
    <ul>
      {#each players as player}
      {#if player}<li>{player.name}</li>{/if}
      {/each}
    </ul>
  </section>
  <section class="level-select grow scroll">
    <ArcadeButton flex={true}>Level 1</ArcadeButton>
    <ArcadeButton flex={true}>Level 2</ArcadeButton>
    <ArcadeButton flex={true}>Level 3</ArcadeButton>
  </section>
</div>
  {/if}
</main>

<style lang="sass">
.level-select
  display: flex
  flex-direction: column
  padding: 16px
  gap: 20px 16px

.players
  h2
    padding-block-end: 12px
  ul
    list-style: none
    padding: 0
    li
      display: block
      padding: 4px
      border-radius: 8px
</style>
