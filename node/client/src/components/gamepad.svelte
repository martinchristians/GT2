<script lang="ts">
  import ArcadeButton from './arcade-button.svelte'

  import IconFlip from '../assets/btn/btn-flip.svg'
  import IconGo from '../assets/btn/btn-go.svg'
  import IconJump from '../assets/btn/btn-jump.svg'
  import IconLeft from '../assets/btn/btn-left.svg'
  import IconRight from '../assets/btn/btn-right.svg'
  import IconSignalLeft from '../assets/btn/btn-signal-left.svg'
  import IconSignalRight from '../assets/btn/btn-signal-right.svg'
  import IconStop from '../assets/btn/btn-stop.svg'
  import type { GamepadLayout } from '@server/messages'
  import { ButtonColor } from '@server/messages'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  function getIcon(icon: ButtonIcon): string {
    switch (icon) {
      case ButtonIcon.Flip:
        return IconFlip
      case ButtonIcon.Go:
        return IconGo
      case ButtonIcon.Jump:
        return IconJump
      case ButtonIcon.Left:
        return IconLeft
      case ButtonIcon.Right:
        return IconRight
      case ButtonIcon.SignalLeft:
        return IconSignalLeft
      case ButtonIcon.SignalRight:
        return IconSignalRight
      case ButtonIcon.Stop:
        return IconStop
    }
  }

  enum ButtonIcon {
    Flip = 'flip',
    Go = 'go',
    Jump = 'jump',
    Left = 'left',
    Right = 'right',
    SignalLeft = 'signal-left',
    SignalRight = 'signal-right',
    Stop = 'stop',
  }

  export let paused: boolean
  export let buttonLayout: GamepadLayout
  export let disabledButtons: Set<string>
</script>

<section
  style={`
grid-template-areas: ${buttonLayout.gridAreas.map((s) => `"${s}"`).join(' ')};
grid-template-columns: ${buttonLayout.gridColumns};
grid-template-rows: ${buttonLayout.gridRows};
  `}
>
  {#each buttonLayout.buttons as button}
    <ArcadeButton
      on:pressed={(e) =>
        dispatch('pressed', { name: button.name, pressed: e.detail })}
      disabled={disabledButtons.has(button.name)}
      style={`grid-area: ${button.name}`}
      multiTouch={true}
      icon={true}
      flex={true}
      variant={button.color}>{@html getIcon(button.icon)}</ArcadeButton
    >
  {/each}
  {#if paused}
    <div class="pausemenu">
      <h1>Paused</h1>
      <div class="actions">
        <ArcadeButton
          variant={ButtonColor.Red}
          on:click={() => dispatch('toMenu')}>Back to Menu</ArcadeButton
        >
        <ArcadeButton on:click={() => dispatch('unpause')}>Resume</ArcadeButton>
      </div>
    </div>
  {/if}
</section>

<style lang="sass">
  section
    position: relative
    display: grid
    flex: 1
    padding-bottom: 24px
    grid-template-columns: 1fr 1fr 1fr
    grid-template-rows: auto 1fr
    gap: 24px 24px
    overflow: hidden
  .pausemenu
    position: absolute
    inset: 0
    z-index: 100
    background: rgba(22, 21, 27, 0.75)
    padding: 32px
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    gap: 16px
    .actions
      display: flex
      gap: 16px
      flex-wrap: wrap
</style>
