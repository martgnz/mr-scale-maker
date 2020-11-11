<style>
  .preview {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
  }
  .chart {
    background: white;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--black);
    position: sticky;
    top: 0;
  }
  .chart-settings {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .chart-selector {
    margin-bottom: 0.75rem;
  }

  @media (min-width: 960px) {
    .preview {
      align-items: flex-start;
      justify-content: space-between;
      flex-direction: row;
    }
    .settings {
      flex-basis: 25%;
    }
    .chart-selector {
      margin-bottom: 0;
    }
    .chart-settings {
      flex-direction: row;
      align-items: center;
    }
    .chart {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
      position: sticky;
      top: 0;
      flex-basis: 70%;
    }
  }
</style>

<script>
  import StepHeader from "./components/StepHeader.svelte";
  import MethodSelector from "./components/MethodSelector.svelte";
  import BreakSelector from "./components/BreakSelector.svelte";
  import ColourSelector from "./components/ColourSelector.svelte";
  import StatisticsSelector from "./components/StatisticsSelector.svelte";
  import Histogram from "./components/Histogram.svelte";
  import Beeswarm from "./components/Beeswarm.svelte";
  import HistogramBins from "./components/HistogramBins.svelte";

  import computeBreaks from "./utils/compute-breaks";
  import {
    breakTicks,
    scale,
    columnData,
    colourScheme,
    selectedBreaks,
    breaks,
  } from "./stores.js";

  const chartComponents = [
    { name: "Histogram", component: Histogram, settings: HistogramBins },
    // { name: "Map", component: Map },
    { name: "Beeswarm", component: Beeswarm },
  ];

  // histogram by default
  let activeChart = chartComponents[0];

  $: if ($columnData) {
    breaks.set(computeBreaks($breakTicks, $columnData.data));

    // save our current settings to the store
    selectedBreaks.set({
      breaks: $breaks[$scale],
      colour: $colourScheme.scheme[$breakTicks + 1],
    });
  }
</script>

<section id="visualise">
  <StepHeader enabled={$columnData} step={3}>
    Visualise the distribution and choose your breaks
  </StepHeader>

  {#if $columnData}
    <div class="preview">
      <div class="settings">
        <MethodSelector />
        <BreakSelector />
        <ColourSelector />
      </div>

      <div class="chart">
        <StatisticsSelector />

        <svelte:component this={activeChart.component} />

        <div class="chart-settings">
          <div class="chart-selector button-group">
            {#each chartComponents as d}
              <button
                class:active={activeChart.name === d.name}
                on:click={() => (activeChart = d)}
              >{d.name}</button>
            {/each}
          </div>

          <svelte:component this={activeChart.settings} />
        </div>
      </div>
    </div>
  {/if}
</section>
