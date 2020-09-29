<style>
  .axis {
    font-family: sans-serif;
    font-size: 13px;
  }
  .x.axis .tick line {
    stroke: #111;
  }
  .y.axis .tick line {
    stroke-opacity: 0.25;
    stroke: #9b9b9b;
  }
  .breaks line {
    stroke: #111;
  }
  .breaks text {
    font-size: 14px;
  }
  .breaks path {
    fill: #111;
  }
  .statistics {
    font-size: 11px;
    fill: #7a7a7a;
  }
  .zero {
    stroke: #111;
  }
  .halo {
    stroke-width: 4px;
    stroke: white;
    stroke-linejoin: round;
  }
  .column-name {
    font-style: italic;
  }

  input[type="number"] {
    text-align: right;
    font-size: 1rem;
    width: 40px;
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
  .statistics {
    display: flex;
    margin-bottom: 0.5rem;
  }
  .settings-row {
    display: flex;
  }
  .settings-row + .settings-row {
    margin-top: 0.75rem;
  }
  .settings-group {
    display: flex;
    align-items: center;
  }
  .settings-group + .settings-group {
    margin-left: 1rem;
  }
  .setting-name {
    display: inline-block;
    font-size: 1rem;
    margin-right: 0.5rem;
  }
  .scales {
    display: flex;
  }
  .statistics .setting-name {
    margin-right: 0.15rem;
  }
  .settings-value {
    /* font-family: monospace; */
  }

  .button-group button {
    cursor: pointer;
    font-size: 1rem;
    background: white;
    padding: 0.3rem 0.75rem;
    border: 1px solid #ccc;
  }
  .button-group button:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .button-group button:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .button-group button:hover {
    background: #e6e6e6;
    border-color: #adadad;
  }
  .button-group button.active {
    border-color: #adadad;
    background: #e6e6e6;
  }
  .button-group button + button {
    margin-left: -1px;
  }
</style>

<script>
  import { pointer } from "d3-selection";
  import { scaleThreshold, scaleLinear } from "d3-scale";
  import { schemeRdPu } from "d3-scale-chromatic";
  import { extent, max, bin, bisector } from "d3-array";
  import { format } from "d3-format";

  import { columnData } from "./stores.js";
  import computeBreaks from "./compute-breaks.js";

  const ft = format(",");
  const ft1 = format(".1f");
  const ftd = format(".4f");

  const margin = { top: 50, right: 10, bottom: 60, left: 10 };
  const width = 960 - margin.right - margin.left;
  const height = 400 - margin.top - margin.bottom;

  // we leave some margin for the y axis ticks
  const xMargin = 30;

  // for the mousemover
  const bisect = bisector(d => d).right;

  // FIXME: is there some way to make adding a new scale easier?
  const scales = ["quantiles", "equal breaks", "ckmeans"];

  let binTicks = 20;
  let binTickOptions = [10, 20, 50, 100];
  let breakTicks = 6;
  let scale = "quantiles";
  let showStatistics = [];

  let x;
  let y;
  let xTicks;
  let yTicks;
  let bins;
  let bisectBins;
  let breaks;
  let colourScheme;
  let colour;

  $: if ($columnData) {
    colourScheme = schemeRdPu;
    breaks = computeBreaks(breakTicks, $columnData.data);

    colour = scaleThreshold()
      .range(colourScheme[breakTicks])
      .domain(breaks[scale]);

    x = scaleLinear()
      .range([xMargin, width])
      .domain(extent($columnData.data, d => d));

    bins = bin()
      .domain(x.domain())
      .thresholds(binTicks)($columnData.data);

    // we don't want to map on every mouseevent
    bisectBins = bins.map(d => d.x1);

    y = scaleLinear()
      .domain([0, max(bins, d => d.length)])
      .range([height, 0]);

    xTicks = x.ticks(6);
    yTicks = y.ticks(6);
  }

  function mousemoved(event) {
    const [mx] = pointer(event);
    const idx = bisect(bisectBins, x.invert(mx));

    // return when no results
    if (idx > bins.length - 1) return;

    const hover = {
      value: bins[idx].length,
      x0: bins[idx].x0,
      x1: bins[idx].x1
    };

    console.log(
      `There are ${hover.value} records betwen ${hover.x0} and ${hover.x1}`
    );
  }
</script>

<section id="visualise">
  <h2>3. Visualise the distribution</h2>

  {#if $columnData}
    <div class="settings">
      <div class="settings-row scales">
        <div class="settings-group">
          <div class="setting-name">Method</div>
          <div class="button-group">
            {#each scales as scaleSelect}
              <button
                on:click={() => (scale = scaleSelect)}
                class={scale === scaleSelect ? 'active' : ''}
              >
                {scaleSelect}
              </button>
            {/each}
          </div>
        </div>

        <div class="settings-group">
          <label class="setting-name" for="breaks">Breaks</label>
          <input
            id="breaks"
            type="number"
            min={3}
            max={colourScheme.length - 1}
            on:change={event => (breakTicks = +event.target.value)}
            value={breakTicks}
          />
        </div>
      </div>

      <div class="settings-row chart-inputs">
        <div class="settings-group">
          <div class="setting-name">Histogram bins</div>

          <div class="button-group">
            {#each binTickOptions as number}
              <button
                on:click={() => (binTicks = number)}
                class={binTicks === number ? 'active' : ''}
              >
                {number}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="statistics">
      {#each breaks.statistics as statistic}
        <div class="settings-group">
          <label for={statistic.label} class="setting-name">
            Show {statistic.label}
          </label>
          <input
            type="checkbox"
            id={statistic.label}
            value={statistic.label}
            bind:group={showStatistics}
          />
        </div>
      {/each}

      <div class="settings-group">
        <div class="setting-name">
          Standard deviation =
          <span class="settings-value">{ftd(breaks.standardDeviation)}</span>
        </div>
      </div>
    </div>
  {/if}

  <div class="preview">
    {#if $columnData}
      <svg
        width={width + margin.right + margin.left}
        height={height + margin.top + margin.bottom}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g class="x axis" transform={`translate(0,${height})`}>
            {#each xTicks as tick}
              <g class="tick" transform={`translate(${x(tick)},0)`}>
                <line y2={6} />
                <text text-anchor="middle" dy={20}>{ft(tick)}</text>
              </g>
            {/each}

            <text class="column-name" x={width / 2} dy={50}>
              {$columnData.column}
            </text>
          </g>
          <g class="y axis">
            {#each yTicks as tick, idx}
              <g class="tick" transform={`translate(0,${y(tick)})`}>
                <line x2={width} />
                <text text-anchor="start" dy={-5} dx={4}>
                  {ft(tick)}{' '}{yTicks.length - 1 === idx ? 'records' : ''}
                </text>
              </g>
            {/each}
          </g>

          <g>
            {#each bins as d}
              <g class="bar" transform={`translate(${x(d.x0)},${y(d.length)})`}>
                <rect
                  width={Math.max(0, x(d.x1) - x(d.x0) - 1)}
                  height={height - y(d.length)}
                  fill={colour(max(d))}
                  stroke="white"
                  stroke-width={0.25}
                />
              </g>
            {/each}
          </g>

          <g class="breaks">
            {#each breaks[scale] as d}
              <g transform={`translate(${x(d)},0)`}>
                <line y1={-15} y2={height} />
                <path transform="translate(-3,-15)" d="M0 0 L 6 0 L 3 7Z" />
                <text text-anchor="middle" dy={-20}>{ft1(d)}</text>
              </g>
            {/each}
          </g>

          <g class="statistics">
            {#each breaks.statistics as d}
              <g
                opacity={showStatistics.includes(d.label) ? 1 : 0}
                transform={`translate(${x(d.value)},${height})`}
              >
                <path transform="translate(-3,0)" d="M0 0 L 6 0 L 3 7Z" />

                <text class="halo" text-anchor="middle" dy={15}>{d.label}</text>
                <text text-anchor="middle" dy={15}>{d.label}</text>
                <text class="halo" text-anchor="middle" dy={28}>
                  {ft1(d.value)}
                </text>
                <text text-anchor="middle" dy={28}>{ft1(d.value)}</text>
              </g>
            {/each}
          </g>

          <line class="zero" y1={height} y2={height} x2={width} />
          <rect fill="transparent" {width} {height} on:mousemove={mousemoved} />
        </g>

      </svg>
    {/if}
  </div>
</section>
