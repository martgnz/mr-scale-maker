<style>
  .statistics {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  .standard-deviation {
    margin-left: 20px;
    font-size: 12px;
  }
  .flex {
    margin-top: 0.25rem;
    display: flex;
    justify-content: flex-start;
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
    .flex {
      margin-top: 0;
      justify-content: flex-end;
    }
  }
</style>

<script>
  import { format } from "d3-format";
  import { showStatistics, breaks } from "../stores";

  const ft = format(".2f");
</script>

<div class="statistics">
  {#if $breaks}
    <div class="standard-deviation">
      Standard deviation
      {ft($breaks.standardDeviation)}
    </div>

    <div class="flex">
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
    </div>
  {/if}
</div>
