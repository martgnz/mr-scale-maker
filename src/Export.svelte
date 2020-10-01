<style>
  .preview {
    margin-top: 1rem;
  }
</style>

<script>
  import { format } from "d3-format";
  import { selectedBreaks } from "./stores.js";
  import Code from "./components/code.svelte";

  // FIXME: we cap at two significant figures
  // should this be bigger?
  const ft = format(".2~f");
</script>

<section id="export">
  <h2>4. Export the scale</h2>

  {#if $selectedBreaks}
    <div class="preview">
      <Code code={$selectedBreaks.breaks.map(ft).join(', ')} />
      <Code code={`[${$selectedBreaks.breaks.map(ft).join(', ')}]`} />
      <Code code={$selectedBreaks.breaks.map(ft).join('\n')} />

      <!-- prettier-ignore -->
      <Code code={
`import { scaleThreshold } from 'd3-scale';

scaleThreshold()
  .range(['${$selectedBreaks.colour.join('\', \'')}'])
  .domain([${$selectedBreaks.breaks.map(ft).join(', ')}]);`
} />
    </div>
  {/if}
</section>
