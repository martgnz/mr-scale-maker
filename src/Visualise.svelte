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
  .histogram-settings {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (min-width: 600px) {
    .preview {
      align-items: flex-start;
      justify-content: space-between;
    }
    .settings {
      flex-basis: 25%;
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
  import HistogramBins from "./components/HistogramBins.svelte";

  import { columnData } from "./stores.js";
</script>

<section id="visualise">
  <StepHeader enabled={$columnData} step={3}>
    Visualise the distribution and choose your breaks
  </StepHeader>

  <div class="preview">
    {#if $columnData}
      <div class="settings">
        <MethodSelector />
        <BreakSelector />
        <ColourSelector />
      </div>

      <div class="chart">
        <Histogram />

        <div class="histogram-settings">
          <HistogramBins />
          <StatisticsSelector />
        </div>
      </div>
    {/if}
  </div>
</section>
