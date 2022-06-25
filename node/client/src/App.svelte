<script lang="ts">
  import type {
    ClientMessage,
    GameMessage,
    GamepadLayout,
    Player,
    ServerMessage,
  } from '@server/messages'
  import ArcadeButton from './components/arcade-button.svelte'
  import GameHeader from './components/game-header.svelte'
  import Gamepad from './components/gamepad.svelte'
  import defaultLayout from './default-layout'
  import Join, { JoinEvent } from './views/join.svelte'

  let view = 'join'
  let paused = false
  let players: Player[] = []
  let buttonLayout: GamepadLayout = defaultLayout
  let disabledButtons = new Set<string>()

  let socket: WebSocket | null = null
  let error: string | null = null

  function join(e: JoinEvent) {
    error = null
    const { roomCode, playerName } = e.detail
    // create new url with search params
    const host = 'ws://192.168.178.55:3000'
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
    } else if (msg.type === 'game_disconnected') {
      socket = null
      leave()
    } else if (msg.type === 'invalid_message') {
      console.error('Invalid message:', msg)
    } else if (msg.type === 'set_paused') {
      paused = msg.paused
    } else if (msg.type === 'level_started') {
      view = 'game'
      paused = false
      disabledButtons.clear()
      disabledButtons = disabledButtons
      if (msg.layout == 'default') {
        buttonLayout = defaultLayout
      } else {
        buttonLayout = msg.layout
      }
    } else if (msg.type === 'main_menu_opened') {
      view = 'lobby'
    } else if (msg.type === 'set_buttons') {
      if (msg.enabled) {
        msg.buttons.map((b) => disabledButtons.delete(b))
        disabledButtons = disabledButtons
      } else {
        msg.buttons.map((b) => disabledButtons.add(b))
        disabledButtons = disabledButtons
        console.log('disabled buttons', msg.buttons)
      }
    }
  }

  function leave() {
    if (socket) {
      socket.close()
      socket = null
    }
    view = 'join'
  }

  function send(msg: ClientMessage) {
    if (socket) {
      socket.send(JSON.stringify(msg))
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
    <GameHeader
      {paused}
      gameRunning={view === 'game'}
      on:leave={leave}
      on:pause={() => send({ type: 'request_pause', pause: !paused })}
    />
  {/if}

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
        <h2>Level</h2>
        {#each [1, 2, 3] as level}
          <ArcadeButton
            flex={true}
            on:click={() =>
              send({
                type: 'start_level',
                level,
              })}>Level {level}</ArcadeButton
          >
        {/each}
      </section>
    </div>
  {:else if view === 'game'}
    <Gamepad
      {buttonLayout}
      {disabledButtons}
      {paused}
      on:pressed={(e) =>
        send({
          type: 'button_pressed',
          button: e.detail.name,
          pressed: e.detail.pressed,
        })}
      on:toMenu={() =>
        send({
          type: 'return_to_menu',
        })}
      on:unpause={() =>
        send({
          type: 'request_pause',
          pause: false,
        })}
    />
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
