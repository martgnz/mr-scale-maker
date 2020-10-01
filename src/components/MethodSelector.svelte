<script>
  import Setting from "./setting.svelte";
  import { scale } from "../stores";

  // FIXME: is there some way to make adding a new scale easier?
  const scales = ["quantiles", "equal breaks", "ckmeans"];
</script>

<Setting name={'Method'}>
  <div class="button-group">
    {#each scales as scaleSelect}
      <button
        on:click={() => ($scale = scaleSelect)}
        class={$scale === scaleSelect ? 'active' : ''}
      >
        {scaleSelect}
      </button>
    {/each}
  </div>
</Setting>
