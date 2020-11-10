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
  .circles circle {
    stroke: var(--black);
  }
  .hover-circle {
    stroke: var(--black);
    stroke-width: 2;
    fill: none;
  }
  .breaks text {
    /* font-family: var(--mono); */
    font-size: 12px;
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
    width: 60px;
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
  import { voronoi } from "d3-voronoi";
  import { extent } from "d3-array";
  import { forceSimulation, forceX, forceY, forceCollide } from "d3-force";

  import Statistics from "./Statistics.svelte";
  import { scale, columnData, selectedBreaks, breaks } from "../stores.js";

  const ft0 = format(",.0f");
  const ft = format(".2~f");

  let x;
  let z;
  let xTicks;
  let hover;
  let container;
  let windowWidth;
  let width;
  let height;
  let data;
  let radius;
  let circleOpacity;
  let v;

  const margin = { top: 35, right: 20, bottom: 50, left: 20 };

  // for the mousemover
  const xCounter = scaleLinear().range([0, 60]);

  const radiusScale = scaleThreshold()
    .range([8, 5, 2])
    .domain([100, 500, 1000]);

  const opacity = scaleThreshold().range([1, 0.25]).domain([1000]);

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
    data = $columnData.data.slice().map((d) => ({ x0: d }));
    radius = radiusScale(data.length);
    circleOpacity = opacity(data.length);

    x = scaleLinear()
      .range([0, width])
      .domain(extent(data, (d) => d.x0));

    z = scaleThreshold().range($selectedBreaks.colour).domain($breaks[$scale]);

    const force = forceSimulation(data)
      .force(
        "x",
        forceX((d) => x(d.x0))
      )
      .force("y", forceY(height / 2))
      .force("collide", forceCollide(radius + 0.75))
      .stop();

    // 120 iterations
    for (let i = 0; i < 120; i++) {
      force.tick();
    }

    v = voronoi()
      .x((d) => d.x)
      .y((d) => d.y)(data);

    xTicks = x.ticks(6);
  }

  function mousemoved(event) {
    const [mx, my] = pointer(event);
    const datum = v.find(mx, my, 50);

    // return when no results
    if (!datum) return (hover = null);

    hover = {
      mx: mx - xCounter(mx),
      my,
      x: datum.data.x,
      y: datum.data.y,
      value: datum.data.x0,
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

      <g class="circles">
        {#each data as d}
          <circle
            stroke-width={0.5}
            stroke-opacity={circleOpacity}
            r={radius}
            cx={d.x}
            cy={d.y}
            fill={z(d.x0)}
          />
        {/each}
      </g>

      <g class="breaks">
        {#each $breaks[$scale] as d}
          <g transform={`translate(${x(d)},0)`}>
            <line y1={-12} y2={height} />
            <text text-anchor="middle" dy={-20}>
              {d > 100 ? ft0(d) : ft(d)}
            </text>
          </g>
        {/each}
      </g>

      <Statistics {x} {height} />

      {#if hover}
        <circle class="hover-circle" cx={hover.x} cy={hover.y} r={radius} />
      {/if}

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
      {hover.value > 100 ? ft0(hover.value) : ft(hover.value)}
    </div>
  {/if}
</div>
