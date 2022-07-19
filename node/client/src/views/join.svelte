<script context="module" lang="ts">
  export interface JoinEvent extends CustomEvent {
    detail: {
      roomCode: string
      playerName: string
    }
  }
</script>

<script lang="ts">
  import ArcadeButton from '../components/arcade-button.svelte'
  import TextField from '../components/text-field.svelte'
  import Logo from '../assets/logo-on-dark.svg'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let error: null | string = null

  let roomCode = ''
  let playerName = ''

  $: disabled =
    roomCode.length < 1 || playerName.length < 2 || playerName.length > 20

  function join() {
    dispatch('join', { roomCode, playerName })
  }
</script>

<form on:submit|preventDefault={join}>
  {@html Logo}
  {#if error}
    <div class="error">{error}</div>
  {/if}
  <TextField label="Room code" uppercase={true} bind:value={roomCode} />
  <TextField label="Your name" bind:value={playerName} />
  <ArcadeButton {disabled}>Join</ArcadeButton>
</form>

<style lang="sass">
  form
    :global(> svg)
      width: 100%
    flex-direction: column
    padding: 32px
    display: flex
    gap: 16px
    overflow-y: auto
    min-height: min-content
</style>
