<style>
  section {
    margin-bottom: 2rem;
  }
  .preview {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .settings {
    flex-basis: 25%;
  }
  .chart {
    position: sticky;
    top: 0;
    flex-basis: 70%;
  }
  .histogram-settings {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
