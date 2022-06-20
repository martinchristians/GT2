<script lang="ts">
  import { uniqueId } from '../utils'

  export let label: string
  export let value = null
  export let disabled = false

  export let placeholder: string | null = null

  const inputId = uniqueId('input')
</script>

<div>
  <label for={inputId}>{label}</label>
  <input
    id={inputId}
    type="input"
    bind:value
    {placeholder}
    {disabled}
  />
</div>

<style lang="sass">
  div
    display: flex
    flex-direction: column
    gap: 4px
  input
    padding: 16px
    background: var(--wds-dark-grey-50)
    border: 1px solid var(--wds-genuine-black)
    box-shadow: inset 0px 0px 0px 1px rgba(255, 255, 255, 0.2)
    border-radius: 8px
</style>
