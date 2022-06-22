<script context="module" lang="ts">
  export enum ButtonColor {
    Blue = 'blue',
    Neon = 'neon',
    Green = 'green',
    Yellow = 'yellow',
    Red = 'red',
    Orange = 'orange',
    Pink = 'pink',
    Purple = 'purple',
  }
</script>

<script lang="ts">
  export let variant: ButtonColor = ButtonColor.Blue
  export let flex = false
  export let disabled: undefined | boolean = undefined
</script>

<div>
  <button
    class={`${flex ? 'flex' : ''} ${variant}`}
    {disabled}
    on:click
    on:submit|preventDefault
  >
    <div><span><slot /></span></div>
  </button>
</div>

<style lang="sass">
$colors: "blue", "neon", "green", "yellow", "red", "orange", "pink", "purple"
$colors-light: "neon", "green", "yellow"

button
  border: none
  font-weight: 600
  color: var(--wds-genuine-white)
  position: relative
  padding: 0
  margin-bottom: 8px
  > div
    overflow: hidden
    transition: transform 100ms cubic-bezier(0.4, 0.6, 0.8, 2.0), background-color 500ms cubic-bezier(1, 2.25, 0.1, -0.5)
    box-shadow: inset 0px 0px 0px 2px rgba(0, 0, 0, 0.1), inset 0px 4px 4px rgba(255, 255, 255, 0.25), inset 0px -4px 4px rgba(0, 0, 0, 0.15)
    border-radius: 12px
    padding: 16px 32px
    opacity: 0.9
    position: relative
    z-index: 1
    > span
      opacity: 0.95
    &::after
      content: ""
      position: absolute
      inset: 0
      transition: opacity 50ms linear
      background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.5) 31.77%, rgba(255, 255, 255, 0) 100%)
      opacity: .5
  &::after
    content: ""
    position: absolute
    left: 0
    right: 0
    bottom: 0
    top: 0
    transform: translateY(8px)
    border-radius: 12px
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0.25) 100%)
  &::before
    content: ""
    position: absolute
    left: 0
    right: 0
    bottom: 0
    top: 0
    transition: background-color 500ms cubic-bezier(1, 2.25, 0.1, -0.5)
    transform: translateY(8px)
    border-radius: 12px
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25)
  &:active:enabled > div
    transform: translateY(6px)
    &::after
      opacity: 0.9
  @each $color in $colors
    &:global(.#{$color} > div)
      background: var(--wds-#{$color}-50)
    &:global(.#{$color}::before)
      background: var(--wds-#{$color}-70)
  @each $color in $colors-light
    &:global(.#{$color} > div)
      color: var(--wds-#{$color}-90)

  &:disabled
    @each $color in $colors
      &:global(.#{$color} > div)
        background: var(--wds-#{$color}-70)
        transition: background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)
      &:global(.#{$color}::before)
        background: var(--wds-#{$color}-90)
        transition: background-color 250ms cubic-bezier(0.22, 0.61, 0.36, 1)
    > div
      > span
          opacity: 0.6
      &::after
        background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 31.77%, rgba(0, 0, 0, 0.2) 100%)
    &::after
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 10%, rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.5) 100%)

  &.flex
    width: 100%
    height: 100%
    > div
      height: 100%
      box-sizing: border-box
      > div
        height: 100%
</style>
