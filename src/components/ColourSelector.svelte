<style>
  select {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
  .colour-schemes {
    display: inline-block;
  }
  .colour-scheme {
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
  }
  .colour-scheme + .colour-scheme {
    margin-top: 1rem;
  }
  .colour-scheme.active {
    background: #ffffdd;
  }
  .colour-scale {
    display: flex;
  }
</style>

<script>
  import { breakTicks, colourScheme } from "../stores";
  import Setting from "./setting.svelte";
  import colours from "../utils/colours.js";

  // show single-hue by default
  let scaleType = colours[0];
</script>

<Setting name="Colour scale">
  <select bind:value={scaleType} selected={scaleType}>
    {#each colours as colour}
      <option value={colour}>{colour.name}</option>
    {/each}
  </select>

  <div class="colour-schemes">
    {#each scaleType.scales as scale}
      <div
        class={['colour-scheme', $colourScheme.name === scale.name ? 'active' : ''].join(' ')}
        on:click={() => colourScheme.set(scale)}
      >
        <div class="colour-title">{scale.name}</div>
        <div class="colour-scale">
          {#each scale.scheme[$breakTicks + 1] as slice}
            <div style="width:25px;height:15px;background: {slice}" />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Setting>
