<style>
  .preview {
    margin-top: 1rem;
  }
</style>

<script>
  import StepHeader from "./components/StepHeader.svelte";
  import { format } from "d3-format";
  import { selectedBreaks } from "./stores.js";
  import Code from "./components/Code.svelte";

  // FIXME: if it is over 100 we ignore decimals
  // is this too restrictive?
  const ft0 = format(".0f");
  const ft = format(".1f");

  let breaks;
  $: if ($selectedBreaks) {
    breaks = $selectedBreaks.breaks.map((d) => (d > 100 ? ft0(d) : ft(d)));
  }
</script>

<section id="export">
  <StepHeader enabled={$selectedBreaks} step={4}>Export the scale</StepHeader>

  {#if $selectedBreaks}
    <div class="preview">
      <Code code={breaks.join(', ')} />
      <Code code={`[${breaks.join(', ')}]`} />
      <Code code={breaks.join('\n')} />

      <!-- prettier-ignore -->
      <Code code={
`import { scaleThreshold } from 'd3-scale';

scaleThreshold()
  .range(['${$selectedBreaks.colour.join('\', \'')}'])
  .domain([${breaks.join(', ')}]);`
} />
    </div>
  {/if}
</section>
