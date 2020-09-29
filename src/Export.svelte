<style>
  .preview {
    margin-top: 1rem;
  }
  pre {
    font-family: monospace;
    background: #eee;
    overflow: auto;
    padding: 1rem;
    margin-bottom: 1rem;
  }
</style>

<script>
  import { format } from "d3-format";
  import { selectedBreaks } from "./stores.js";

  // FIXME: we cap at two significant figures
  // should this be bigger?
  const ft = format(".2~f");
</script>

<section id="export">
  <h2>4. Export the scale</h2>

  {#if $selectedBreaks}
    <div class="preview">
      <pre>{$selectedBreaks.breaks.map(ft).join(', ')}</pre>
      <pre>{$selectedBreaks.breaks.map((d) => `'${ft(d)}'`).join(', ')}</pre>
      <pre>[{$selectedBreaks.breaks.map((d) => `'${ft(d)}'`).join(', ')}]</pre>
      <pre>{$selectedBreaks.breaks.map(ft).join('\n')}</pre>

      <!-- prettier-ignore -->
      <pre>
import &#123; scaleThreshold &#125; from 'd3-scale';

scaleThreshold()
  .range(['{$selectedBreaks.colour.join(`', '`)}'])
  .domain(['{$selectedBreaks.breaks.map(ft).join(`', '`)}']);
      </pre>
    </div>
  {/if}
</section>
