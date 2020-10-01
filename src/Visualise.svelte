<style>
  section {
    margin-bottom: 2rem;
  }
  .preview {
    position: relative;
  }

  .settings,
  .settings-map-block {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
  }
  @media (min-width: 900px) {
    .settings,
    .settings-map-block {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>

<script>
  import MethodSelector from "./components/MethodSelector.svelte";
  import BreakSelector from "./components/BreakSelector.svelte";
  import ColourSelector from "./components/ColourSelector.svelte";
  import StatisticsSelector from "./components/StatisticsSelector.svelte";
  import Histogram from "./components/Histogram.svelte";
  import Map from "./components/Map.svelte";

  import { columnData } from "./stores.js";
</script>

<section id="visualise">
  <h2>3. Visualise the distribution</h2>

  {#if $columnData}
    <div class="settings">
      <MethodSelector />
      <BreakSelector />
      <StatisticsSelector />
    </div>

    <div class="preview">
      <Histogram />
    </div>

    <div class="settings-map-block">
      <ColourSelector />
      <Map />
    </div>
  {/if}
</section>
