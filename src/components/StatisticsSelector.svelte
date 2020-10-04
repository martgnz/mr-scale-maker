<style>
  .statistics {
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
  }
  .statistic + .statistic {
    margin-left: 0;
  }
  @media (min-width: 600px) {
    .statistics {
      flex-direction: row;
    }
    .statistic + .statistic {
      margin-left: 0.5rem;
    }
  }
</style>

<script>
  import { showStatistics, breaks } from "../stores";
</script>

<div class="statistics">
  {#if $breaks}
    {#each $breaks.statistics as statistic}
      <div class="statistic">
        <input
          type="checkbox"
          id={statistic.label}
          value={statistic.label}
          bind:group={$showStatistics}
        />
        <label for={statistic.label} class="setting-name">
          Show
          {statistic.label}
        </label>
      </div>
    {/each}
  {/if}
</div>
