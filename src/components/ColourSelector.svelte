<style>
  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    box-sizing: border-box;
    display: block;
    font-size: 1rem;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    padding: 7px 10px 7px 5px;
    width: 100%;
    max-width: 100%;
    border: 1px solid var(--grey-stroke);
    background-color: #fff;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23979797%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
  }
  select::-ms-expand {
    display: none;
  }
  select:hover {
    border-color: var(--black);
  }
  select:focus {
    border-color: var(--black);
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }

  .colour-title {
    margin-bottom: 0.15rem;
  }
  label {
    cursor: pointer;
  }
  .colour-scheme {
    cursor: pointer;
    padding: 8px 0;
    padding-top: 6px;
  }
  .colour-scheme:not(:last-child) {
    border-bottom: 1px solid var(--grey);
    margin-bottom: 0.25rem;
    padding-bottom: 1rem;
  }
  .colour-scheme.active {
    font-weight: 500;
  }
  .colour-title {
    display: flex;
    align-items: center;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  .colour-scale {
    outline: 1px solid var(--grey);
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
        <div class="colour-title">
          <label><input
              type="radio"
              checked={$colourScheme.name === scale.name}
              value={scale.name}
            />
            {scale.name}
          </label>
        </div>

        <div class="colour-scale">
          {#each scale.scheme[$breakTicks + 1] as slice}
            <div
              style="width:{100 / $breakTicks + 1}%;height:12px;background: {slice}"
            />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Setting>
