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

  let min = 3;
  let max = $colourScheme.scheme[$colourScheme.scheme.length - 1].length - 1;

  function handleBreakChange(event) {
    const value = +event.target.value;
    if (value < min || value > max) return;
    return ($breakTicks = +event.target.value);
  }
</script>

<Setting name={'Number of breaks'}>
  <input
    id="breaks"
    type="number"
    {min}
    {max}
    on:change={handleBreakChange}
    value={$breakTicks}
  />
</Setting>
