<style>
  input[type="number"] {
    text-align: left;
    padding: 0.25rem 0.5rem;
    font-size: 1.25rem;
    width: 40px;
  }
</style>

<script>
  import Setting from "./Setting.svelte";
  import { breakTicks, colourScheme } from "../stores.js";
</script>

<Setting name={'Number of breaks'}>
  <input
    id="breaks"
    type="number"
    min={3}
    max={$colourScheme.scheme[$colourScheme.scheme.length - 1].length - 1}
    on:change={(event) => ($breakTicks = +event.target.value)}
    value={$breakTicks}
  />
</Setting>
