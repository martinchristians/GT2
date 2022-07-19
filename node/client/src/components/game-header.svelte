<script lang="ts">
  import { ButtonColor } from '@server/messages'
  import { createEventDispatcher } from 'svelte'

  import ArcadeButton from './arcade-button.svelte'
  import IconExit from '../assets/icons/48-exit.svg'
  import IconFullscreen from '../assets/icons/48-fullscreen.svg'
  import IconPause from '../assets/icons/48-pause.svg'
  import IconPlay from '../assets/icons/48-play.svg'

  import DbIconLeft from '../assets/db/db-arrow-left.svg'
  import DbIconRight from '../assets/db/db-arrow-right.svg'
  import DbIconFuel from '../assets/db/db-fuel.svg'
  import DbIconMotor from '../assets/db/db-motor.svg'

  const dispatch = createEventDispatcher()

  const iconsLeft = [DbIconLeft, DbIconFuel]
  const iconsRight = [DbIconMotor, DbIconRight]

  export let paused: number
  export let gameRunning: boolean

  function toggleFullscreen() {
    if (window.innerHeight == screen.height) {
      document.exitFullscreen()
    } else {
      const elem = document.querySelector('main')
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        ;(elem as any).webkitRequestFullscreen()
      }
    }
  }
</script>

<header>
  <ArcadeButton
    on:click={() => dispatch('leave')}
    icon={true}
    variant={ButtonColor.Red}>{@html IconExit}</ArcadeButton
  >
  <div class="lcd">
    <span />
    {#each iconsLeft as icon}
      <div class="db-icon">{@html icon}</div>
    {/each}
    <p>106.2 RADIO FM</p>
    {#each iconsRight as icon}
      <div class="db-icon">{@html icon}</div>
    {/each}
  </div>
  <ArcadeButton on:click={toggleFullscreen} icon={true}
    >{@html IconFullscreen}</ArcadeButton
  >
  <ArcadeButton
    icon={true}
    disabled={!gameRunning}
    variant={gameRunning && paused < 1 ? ButtonColor.Yellow : ButtonColor.Green}
    on:click={() => dispatch('pause')}
  >
    {#if gameRunning && paused < 1}
      {@html IconPause}
    {:else}
      {@html IconPlay}
    {/if}
  </ArcadeButton>
</header>

<style lang="sass">
  header
    display: flex
    gap: 16px
  .lcd
    display: flex
    justify-content: center
    align-items: center
    color: var(--wds-yellow-80)
    font-family: "Digital7", monospace
    flex: 1
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0) 10.42%, rgba(255, 255, 255, 0.0258824) 86.98%, rgba(255, 255, 255, 0.66) 100%), radial-gradient(50% 202.81% at 50% 50%, #F6FD6C 0%, #D2AB2C 100%)
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.1)
    border-radius: 16px
    position: relative
    overflow: hidden
    padding-inline: 12px
    gap: 12px
    .db-icon
      opacity: .25
      display: inline
      line-height: 0
    p
      flex: 1
      text-align: center
      font-size: 24px
    > span::after, > span::before, &::after, &::before
      content: ""
      position: absolute
    > span
      position: absolute
      &::after
        inset: 0
        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%)
        background-size: 16px 3px
        mix-blend-mode: overlay
      &::before
        background-image: url('/radio-seperator.svg')
        left: 0
        right: 0
        bottom: 0
        height: 12px
    &::after, &::before
      background: rgba(255, 255, 255, 0.75)
      left: -30%
      transform: rotateZ(-45deg)
      filter: blur(8px)
      width: 50%
      height: 300%
      mix-blend-mode: soft-light
    &::before
      left: 40%
</style>
