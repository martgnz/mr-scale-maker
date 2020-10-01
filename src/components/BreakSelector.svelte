<style>
  input[type="number"] {
    text-align: right;
    font-size: 1rem;
    width: 40px;
  }
</style>

<script>
  import Setting from "./setting.svelte";
  import { breakTicks, colourScheme } from "../stores.js";
</script>

<Setting name={'Breaks'}>
  <input
    id="breaks"
    type="number"
    min={3}
    max={$colourScheme.scheme[$colourScheme.scheme.length - 1].length - 1}
    on:change={(event) => ($breakTicks = +event.target.value)}
    value={$breakTicks}
  />
</Setting>
