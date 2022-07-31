<script lang="ts">
  import type {
    ClientMessage,
    GameMessage,
    GamepadLayout,
    Player,
    ServerMessage,
  } from '@server/messages'
  import {ButtonColor} from '@server/messages'
  import ArcadeButton from './components/arcade-button.svelte'
  import GameHeader from './components/game-header.svelte'
  import Gamepad from './components/gamepad.svelte'
  import defaultLayout from './default-layout'
  import jumpLayout from './jump-layout'
  import Join, { JoinEvent } from './views/join.svelte'
  import IconCar from './assets/btn/btn-car.svg'

  let view = 'join'
  let paused = 0
  let me = {
    name: '',
    id: -1,
  }
  let players: Player[] = []
  let buttonLayout: GamepadLayout = defaultLayout
  let disabledButtons = new Set<string>()

  let socket: WebSocket | null = null
  let error: string | null = null

  function join(e: JoinEvent) {
    error = null
    const { roomCode, playerName } = e.detail
    // create new url with search params
    me.name = playerName

    const locationUrl = new URL(window.location.href)

    const url = new URL(`ws://${locationUrl.hostname}:3000/joinGame`)
    url.searchParams.set('room', roomCode)
    url.searchParams.set('name', playerName)

    try {
      socket = new WebSocket(url)
    } catch (e) {
      console.log('sss')
      error = 'Failed to connect with server.'
      return
    }

    socket.addEventListener('error', () => {
      error = 'Could not connect to game. Did you enter a valid room code?'
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
      if (msg.name === me.name) {
        me.id = msg.id
      }
    } else if (msg.type === 'player_left') {
      players[msg.id] = undefined
    } else if (msg.type === 'game_disconnected') {
      window.navigator.vibrate &&  window.navigator.vibrate(200)
      socket = null
      leave()
    } else if (msg.type === 'invalid_message') {
      console.error('Invalid message:', msg)
    } else if (msg.type === 'set_paused') {
      window.navigator.vibrate &&  window.navigator.vibrate(200)
      if (msg.paused === false) {
        paused = 0
      } else {
        paused = msg.player == me.id ? 1 : 2
      }
    } else if (msg.type === 'level_started') {
      window.navigator.vibrate &&  window.navigator.vibrate(200)
      view = 'game'
      paused = 0
      disabledButtons.clear()
      disabledButtons = disabledButtons
      if (msg.layout == 'default') {
        buttonLayout = defaultLayout
      } else if (msg.layout == 'jump') {
        buttonLayout = jumpLayout
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
      window.navigator.vibrate &&  window.navigator.vibrate([150, 50, 150])
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
        <ArcadeButton
          flex={true}
          on:click={() =>
            send({
              type: 'start_level',
              level: 1,
            })}>Play Tutorial</ArcadeButton
        >
        <ArcadeButton
          flex={true}
          variant={ButtonColor.Green}
          on:click={() =>
            send({
              type: 'start_level',
              level: 2,
            })}>{@html IconCar}<p>Play Game</p></ArcadeButton
        >
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
  padding: 32px
  gap: 32px
  :global(:nth-child(2))
    flex: 1

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

.error
  position: fixed
  left: 16px
  right: 16px
  top: 16px
  background-color: var(--wds-red-10)
  color: var(--wds-red-90)
  border: 1px solid var(--wds-red-80)
  border-radius: 16px
  padding: 16px
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.75)
</style>
