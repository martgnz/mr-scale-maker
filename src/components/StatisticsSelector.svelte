<style>
  .statistics {
    display: flex;
    font-size: 12px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .standard-deviation {
    margin-top: 0.25rem;
  }
  .flex {
    margin-top: 0.25rem;
    display: flex;
    justify-content: flex-start;
  }
  .statistic + .statistic {
    margin-left: 0.5rem;
  }

  @media (min-width: 600px) {
    .standard-deviation {
      margin-top: 0;
      margin-left: 20px;
    }
    .statistics {
      align-items: center;
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
