<style>
  .container {
    position: relative;
  }
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
  .tooltip {
    background: white;
    position: absolute;
    pointer-events: none;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    border: 1px solid #f5f5f5;
    width: 140px;
    font-size: 12px;
    line-height: 1.2;
    padding: 5px;
  }
</style>

<script>
  import { onMount } from "svelte";
  import { pointer } from "d3-selection";
  import { scaleThreshold, scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { extent, max, bin, bisector } from "d3-array";

  import computeBreaks from "../utils/compute-breaks";
  import {
    breakTicks,
    scale,
    columnData,
    colourScheme,
    selectedBreaks,
    binTicks,
    showStatistics,
    breaks,
  } from "../stores.js";

  const ft = format(",");
  const ft1 = format(".1f");

  let x;
  let y;
  let z;
  let xTicks;
  let yTicks;
  let bins;
  let bisectBins;
  let hover;
  let container;
  let width;
  let height;

  const margin = { top: 50, right: 10, bottom: 60, left: 10 };

  onMount(() => {
    handleResize();
  });

  function handleResize() {
    const nodeWidth = container.getBoundingClientRect().width;
    const isMobile = nodeWidth < 600;
    const ratio = isMobile ? 0.75 : 0.5;

    width = nodeWidth - margin.right - margin.left;
    height = Math.min(nodeWidth * ratio, 400) - margin.top - margin.bottom;
  }

  // for the mousemover
  const bisect = bisector((d) => d).right;

  $: if ($columnData) {
    // FIXME: swap n of breaks when switching from a divergent to a normal scale
    breaks.set(computeBreaks($breakTicks, $columnData.data));

    // save our current settings to the store
    selectedBreaks.set({
      breaks: $breaks[$scale],
      colour: $colourScheme.scheme[$breakTicks + 1],
    });

    x = scaleLinear()
      .range([0, width])
      .domain(extent($columnData.data, (d) => d));

    bins = bin().domain(x.domain()).thresholds($binTicks)($columnData.data);

    // we don't want to map on every mouseevent
    bisectBins = bins.map((d) => d.x1);

    y = scaleLinear()
      .domain([0, max(bins, (d) => d.length)])
      .range([height, 0]);

    z = scaleThreshold().range($selectedBreaks.colour).domain($breaks[$scale]);

    xTicks = x.ticks(6);
    yTicks = y.ticks(6);
  }

  function mousemoved(event) {
    const [mx, my] = pointer(event);
    const idx = bisect(bisectBins, x.invert(mx));

    // return when no results
    if (idx > bins.length - 1) return;

    hover = {
      mx,
      my,
      value: bins[idx].length,
      x0: bins[idx].x0,
      x1: bins[idx].x1,
    };
  }
</script>

<svelte:window on:resize={handleResize} />

<div bind:this={container} class="container">
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
          </g>
        {/each}
      </g>

      <g>
        {#each bins as d}
          <g class="bar" transform={`translate(${x(d.x0)},${y(d.length)})`}>
            <rect
              width={Math.max(0, x(d.x1) - x(d.x0) - 1)}
              height={height - y(d.length)}
              fill={z(max(d))}
              stroke={hover ? hover.x0 === d.x0 && 'black' : 'white'}
              stroke-width={hover ? hover.x0 === d.x0 && 1.5 : 0.25}
            />
          </g>
        {/each}
      </g>

      <g class="y axis">
        {#each yTicks as tick, idx}
          <g class="tick" transform={`translate(0,${y(tick)})`}>
            <text text-anchor="start" dy={-5} dx={4}>
              {ft(tick)}{' '}{yTicks.length - 1 === idx ? 'records' : ''}
            </text>
          </g>
        {/each}
      </g>

      <g class="breaks">
        {#each $breaks[$scale] as d}
          <g transform={`translate(${x(d)},0)`}>
            <line y1={-15} y2={height} />
            <path transform="translate(-3,-15)" d="M0 0 L 6 0 L 3 7Z" />
            <text text-anchor="middle" dy={-20}>{ft1(d)}</text>
          </g>
        {/each}
      </g>

      <g class="statistics">
        {#each $breaks.statistics as d}
          <g
            opacity={$showStatistics.includes(d.label) ? 1 : 0}
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
      <rect
        fill="transparent"
        {width}
        {height}
        on:mousemove={mousemoved}
        on:mouseleave={() => (hover = null)}
      />
    </g>
  </svg>

  {#if hover}
    <div
      class="tooltip"
      style="left: {hover.mx - 50}px; top: {hover.my - 10}px"
    >
      There
      {hover.value === 1 ? 'is' : 'are'}
      {hover.value}
      record{hover.value === 1 ? '' : 's'}
      between
      {hover.x0}
      and
      {hover.x1}
    </div>
  {/if}
</div>
