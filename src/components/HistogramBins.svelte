<style>
  .histogram-bins {
    display: flex;
    flex-direction: column;
  }
  .histogram-bins-title {
    font-size: 0.85rem;
    margin-bottom: 0.15rem;
  }
  @media (min-width: 600px) {
    .histogram-bins {
      font-size: 1rem;
      align-items: center;
      flex-direction: row;
    }
    .histogram-bins-title {
      margin-right: 0.5rem;
    }
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
