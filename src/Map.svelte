<style>
  .polygon {
    stroke: #fff;
    stroke-width: 0.5;
    fill: #cccccc;
  }
  #selected-country {
    text-align: center;
  }
</style>

<script>
  import { geoTransverseMercator, geoPath } from "d3-geo";
  import { document } from "lodash/_freeGlobal";
  import { onMount } from "svelte";
  import { feature, mesh } from "topojson";

  import countries from "./countries.js";
  const country = countries[Math.floor(Math.random() * countries.length)];
  let path = () => {};
  let data = [];
  let width, height;
  onMount(async function () {
    const response = await fetch(`geo/${country}.json`);
    const json = await response.json();
    // const features = mesh(json, json.objects[country], (a, b) => a !== b);
    const { features } = feature(json, json.objects[country]);
    data = features;
    width = document.querySelector("#visualise-map").getBoundingClientRect()
      .width;
    height = width * 0.5;
    const projection = geoTransverseMercator().fitExtent(
      [
        [5, 5],
        [width, height],
      ],
      feature(json, json.objects[country])
    );
    path = geoPath().projection(projection);
    document.querySelector("#selected-country").innerHTML = country
      .split("_")
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  });
</script>

<section id="visualise-map">
  <svg {width} {height}>
    {#each data as feature}
      <path d={path(feature)} class="polygon" />
    {/each}
  </svg>
  <div id="selected-country" />
</section>
