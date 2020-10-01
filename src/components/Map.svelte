<style>
  .polygon {
    stroke-width: 0.1;
  }
  #selected-country {
    text-align: center;
  }
  .map {
    flex-basis: 66.66%;
  }
</style>

<script>
  import { geoTransverseMercator, geoPath } from "d3-geo";
  import { sum, ascending, descending } from "d3-array";
  import { document } from "lodash/_freeGlobal";
  import { onMount } from "svelte";
  import { feature, neighbors } from "topojson";

  import countries from "../countries.js";
  import { colourScale, binsData } from "../stores.js";

  const country = countries[Math.floor(Math.random() * countries.length)];
  let path = () => {};
  let data = [];
  let width, height;
  let bins;
  let colour;

  $: if ($binsData) {
    bins = $binsData;
    colour = $colourScale;
    onMount(async function () {
      const response = await fetch(`geo/${country}.json`);
      const json = await response.json();
      // const features = mesh(json, json.objects[country], (a, b) => a !== b);
      const { features } = feature(json, json.objects[country]);
      data = features;

      const randomIndex = Math.floor(Math.random() * features.length);
      const randomFeature = features[randomIndex];
      const mapSettings = getMapSettings({ json, country });
      const { projection } = mapSettings;
      width = mapSettings.width;
      height = mapSettings.height;

      path = geoPath().projection(projection);

      data.forEach((d) => {
        d.properties.centroid = path.centroid(d);
      });

      const ranges = bins
        .map((bin, idx) => {
          return {
            value: bins[idx].length,
            range: [bins[idx].x0, bins[idx].x1],
          };
        })
        .filter((d) => d.value > 0)
        .sort((b, a) => a.value - b.value);

      const totalRanges = sum(ranges, (d) => d.value);
      ranges.forEach((range) => {
        range.percent = Number(((range.value / totalRanges) * 100).toFixed(2));
        range.nFeatures = Math.floor((range.percent / 100) * features.length);
      });

      let rangeIndex = 0;
      let featuresAssigned = 0;
      let outOfRange = 0;

      data
        .sort((b, a) => {
          return ascending(a.properties.centroid[0], b.properties.centroid[0]);
        })
        .sort((b, a) => {
          return descending(a.properties.centroid[1], b.properties.centroid[1]);
        })
        .forEach((country, i) => {
          const { range, nFeatures } = ranges[rangeIndex];
          const value = Math.random() * (range[1] - range[0]) + range[0]; // random number in given range
          country.properties.value = value;

          featuresAssigned++;
          if (featuresAssigned >= nFeatures) {
            rangeIndex++;
            featuresAssigned = 0;
          }
          // we can't count features as decimal so it is possible that a few polygons get out of range
          // so we started the count from scratch
          if (rangeIndex >= ranges.length) {
            rangeIndex = 0;
            outOfRange++;
            console.log({ outOfRange });
          }
        });
      console.log(`${outOfRange} features out of range`);
      setCountryName.call(this, name);
    });
  }

  function getMapSettings(settings) {
    const { json, country } = settings;
    const width = getWidth();
    const ratio = getRatio(width);
    const height = parseInt(width * ratio);
    const projection = getProjection({ json, country, width, height });
    return { width, height, projection };
  }

  function getProjection(settings) {
    const { json, country, width, height } = settings;
    return geoTransverseMercator().fitExtent(
      [
        [5, 5],
        [width, height],
      ],
      feature(json, json.objects[country])
    );
  }

  function getRatio(width) {
    if (width > 600) {
      return 0.5;
    }
    return 0.9;
  }

  function getWidth() {
    const { width } = document.querySelector(".map").getBoundingClientRect();
    return width;
  }

  function setCountryName(name) {
    document.querySelector("#selected-country").innerHTML = country
      .split("_")
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  }
</script>

<div class="map">
  <svg {width} {height}>
    {#each data as feature}
      <path
        d={path(feature)}
        fill={colour(feature.properties.value)}
        stroke={colour(feature.properties.value)}
        class="polygon"
      />
    {/each}
  </svg>
  <div id="selected-country" />
</div>
