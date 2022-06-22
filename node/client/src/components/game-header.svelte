<script lang="ts">
  import ArcadeButton, { ButtonColor } from './arcade-button.svelte'
</script>

<header>
  <ArcadeButton variant={ButtonColor.Red}>Exit</ArcadeButton>
  <div class="lcd">106.2 LOBBY FM</div>
  <ArcadeButton disabled={true} variant={ButtonColor.Yellow}>Pause</ArcadeButton>
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
    font-family: monospace
    flex: 1
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.66) 0%, rgba(255, 255, 255, 0) 10.42%, rgba(255, 255, 255, 0.0258824) 86.98%, rgba(255, 255, 255, 0.66) 100%), radial-gradient(50% 202.81% at 50% 50%, #F6FD6C 0%, #D2AB2C 100%)
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.1)
    border-radius: 16px
    position: relative
    overflow: hidden
    &::before
      content: ""
      position: absolute
      background-image: url('/radio-seperator.svg')
      left: 0
      right: 0
      bottom: 0
      height: 12px
    &::after
      content: ""
      position: absolute
      background: rgba(255, 255, 255, 0.25)
      left: 10%
      transform: rotateZ(-45deg)
      filter: blur(8px)
      width: 40%
      height: 300%
</style>
