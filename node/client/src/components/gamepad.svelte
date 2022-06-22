<script lang="ts">
  import ArcadeButton, { ButtonColor } from './arcade-button.svelte'
</script>

<section>
  <ArcadeButton flex={true} variant={ButtonColor.Green}>A</ArcadeButton>
  <ArcadeButton flex={true} variant={ButtonColor.Orange}>D</ArcadeButton>
  <ArcadeButton flex={true} variant={ButtonColor.Purple}>B</ArcadeButton>
  <ArcadeButton flex={true} variant={ButtonColor.Blue}>C</ArcadeButton>
  <ArcadeButton flex={true} variant={ButtonColor.Neon}>D</ArcadeButton>
  <ArcadeButton flex={true} variant={ButtonColor.Red}>C</ArcadeButton>
</section>

<style lang="sass">
  section
    display: grid
    flex: 1
    padding-top: 16px
    grid-template-columns: 1fr 1fr 1fr
    grid-template-rows: 1fr 1fr
    gap: 24px 24px
</style>
