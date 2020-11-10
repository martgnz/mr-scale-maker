<style>
  .statistics {
    font-size: 11px;
    font-weight: 500;
    fill: var(--black);
  }
</style>

<script>
  import { format } from "d3-format";
  import { columnData, showStatistics, breaks } from "../stores.js";

  export let x;
  export let height;

  const ft0 = format(",.0f");
  const ft = format(".2~f");
</script>

{#if columnData}
  <g class="statistics">
    {#each $breaks.statistics as d}
      <g
        opacity={$showStatistics.includes(d.label) ? 1 : 0}
        transform={`translate(${x(d.value)},${height})`}
      >
        <!-- <rect x={-15} width={30} height={30} fill="white" /> -->
        <path transform="translate(-3,6)" d="M0 0 L 6 0 L 3 -6Z" />
        <text
          text-anchor="middle"
          dy={18}
          stroke-width={6}
          fill="none"
          stroke="white"
          stroke-linejoin="round"
        >
          {d.label}{' '}
          {d.value > 100 ? ft0(d.value) : ft(d.value)}
        </text>
        <text text-anchor="middle" dy={18}>
          {d.label}{' '}
          {d.value > 100 ? ft0(d.value) : ft(d.value)}
        </text>
      </g>
    {/each}
  </g>
{/if}
