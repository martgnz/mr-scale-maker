<style>
  .container {
    position: relative;
  }
  .axis {
    font-family: var(--sans-serif);
    font-size: 13px;
  }
  .x.axis .tick line {
    stroke: var(--black);
  }
  .y.axis .tick line {
    stroke: var(--grey);
  }
  .breaks line {
    stroke: #111;
    stroke-dasharray: 2 2;
  }
  .breaks text {
    /* font-family: var(--mono); */
    font-size: 12px;
  }
  .breaks path {
    fill: var(--black);
  }
  .statistics {
    font-size: 11px;
    fill: var(--black);
  }
  .zero {
    stroke: var(--black);
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
  import { pointer, window } from "d3-selection";
  import { scaleThreshold, scaleLinear } from "d3-scale";
  import { format } from "d3-format";
  import { extent, max, bin, bisector } from "d3-array";

  import computeBreaks from "../utils/compute-breaks";
  import {
    breakTicks,
    scale,
    columnData,
    colourScheme,
    colourScale,
    selectedBreaks,
    binTicks,
    showStatistics,
    breaks,
    binsData,
  } from "../stores.js";

  const ft0 = format(",.0f");
  const ft = format(".2~f");
  const ftc = format(",");

  let x;
  let y;
  let z;
  let xTicks;
  let yTicks;
  let bins;
  let bisectBins;
  let hover;
  let container;
  let windowWidth;
  let width;
  let height;

  const margin = { top: 35, right: 20, bottom: 50, left: 20 };

  // for the mousemover
  const bisect = bisector((d) => d).right;
  const xCounter = scaleLinear().range([0, 140]);

  function handleResize() {
    const nodeWidth = container.getBoundingClientRect().width;
    const isSticky = windowWidth < 960;
    const isMobile = windowWidth < 600;
    const ratio = isMobile ? 0.75 : isSticky ? 0.35 : 0.5;

    width = nodeWidth - margin.right - margin.left;
    height = Math.min(nodeWidth * ratio, 400) - margin.top - margin.bottom;
    xCounter.domain([0, width]);
  }

  onMount(() => {
    handleResize();
  });

  $: if ($columnData) {
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
    binsData.set(bins);

    // we don't want to map on every mouseevent
    bisectBins = bins.map((d) => d.x1);

    y = scaleLinear()
      .domain([0, max(bins, (d) => d.length)])
      .range([height, 0]);

    z = scaleThreshold().range($selectedBreaks.colour).domain($breaks[$scale]);
    colourScale.set(z);

    xTicks = x.ticks(6);
    yTicks = y.ticks(6);
  }

  function mousemoved(event) {
    const [mx, my] = pointer(event);
    const idx = bisect(bisectBins, x.invert(mx));

    // return when no results
    if (idx > bins.length - 1) return;

    hover = {
      mx: mx - xCounter(mx),
      my,
      value: bins[idx].length,
      x0: bins[idx].x0,
      x1: bins[idx].x1,
    };
  }
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={handleResize} />

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
            <text text-anchor="middle" dy={20}>
              {tick > 100 ? ft0(tick) : ft(tick)}
            </text>
          </g>
        {/each}

        <text class="column-name" x={width / 2} dy={40}>
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
          <g transform={`translate(${x(d.x0)},${y(d.length)})`}>
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
            <text text-anchor="start" dy={-5} dx={0}>
              {ft0(tick)}{' '}{yTicks.length - 1 === idx ? 'records' : ''}
            </text>
          </g>
        {/each}
      </g>

      <g class="breaks">
        {#each $breaks[$scale] as d}
          <g transform={`translate(${x(d)},0)`}>
            <line y1={-12} y2={height} />
            <!-- <path transform="translate(-3,-15)" d="M0 0 L 6 0 L 3 7Z" /> -->
            <text text-anchor="middle" dy={-20}>
              {d > 100 ? ft0(d) : ft(d)}
            </text>
          </g>
        {/each}
      </g>

      <g class="statistics">
        {#each $breaks.statistics as d}
          <g
            opacity={$showStatistics.includes(d.label) ? 1 : 0}
            transform={`translate(${x(d.value)},${height})`}
          >
            <rect x={-15} width={30} height={30} fill="white" />
            <path transform="translate(-3,0)" d="M0 0 L 6 0 L 3 7Z" />

            <text text-anchor="middle" dy={15}>{d.label}</text>
            <text text-anchor="middle" dy={28}>
              {d.value > 100 ? ft0(d.value) : ft(d.value)}
            </text>
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
    <div class="tooltip" style="left: {hover.mx}px; top: {hover.my - 10}px">
      There
      {hover.value === 1 ? 'is' : 'are'}
      {ftc(hover.value)}
      record{hover.value === 1 ? '' : 's'}
      between
      {hover.x0 > 100 ? ft0(hover.x0) : ft(hover.x0)}
      and
      {hover.x1 > 100 ? ft0(hover.x1) : ft(hover.x1)}
    </div>
  {/if}
</div>
