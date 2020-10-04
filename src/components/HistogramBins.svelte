<style>
  .histogram-bins {
    display: flex;
    align-items: center;
  }
  .histogram-bins-title {
    margin-right: 0.5rem;
  }
</style>

<script>
  import { binTicks } from "../stores";

  let binTickOptions = [10, 20, 50, 100];
</script>

<div class="histogram-bins">
  <div class="histogram-bins-title">Histogram bins</div>
  <div class="button-group">
    {#each binTickOptions as number}
      <button
        on:click={() => ($binTicks = number)}
        class={$binTicks === number ? 'active' : ''}
      >
        {number}
      </button>
    {/each}
  </div>
</div>
