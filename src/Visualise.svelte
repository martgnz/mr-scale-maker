<style>
  section {
    margin-bottom: 2rem;
  }
  .preview {
    position: relative;
  }

  .settings {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
  }
  @media (min-width: 900px) {
    .settings {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
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

  import { columnData } from "./stores.js";
</script>

<section id="visualise">
  <StepHeader enabled={$columnData} step={3}>
    Visualise the distribution and choose your breaks
  </StepHeader>

  {#if $columnData}
    <div class="settings">
      <MethodSelector />
      <BreakSelector />
      <StatisticsSelector />
    </div>

    <div class="preview">
      <Histogram />
    </div>

    <ColourSelector />
  {/if}
</section>
