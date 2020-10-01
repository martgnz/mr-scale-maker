<script>
  import { showStatistics, breaks } from "../stores";
</script>

<div>
  {#if $breaks}
    {#each $breaks.statistics as statistic}
      <div>
        <label for={statistic.label} class="setting-name">
          Show
          {statistic.label}
        </label>
        <input
          type="checkbox"
          id={statistic.label}
          value={statistic.label}
          bind:group={$showStatistics}
        />
      </div>
    {/each}
  {/if}
</div>
