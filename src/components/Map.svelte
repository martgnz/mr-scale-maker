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
  #boundaries {
    fill: none;
    stroke: #fff;
    stroke-width: 0.3;
    pointer-events: none;
  }
  #start-point {
    fill: darkred;
    stroke: white;
  }
</style>

<script>
  import { geoTransverseMercator, geoPath } from "d3-geo";
  import { sum, ascending, descending } from "d3-array";
  import { Delaunay } from "d3-delaunay";
  import { onMount } from "svelte";
  import { feature, neighbors, mesh } from "topojson";

  import {
    colourScale,
    binsData,
    country,
    countryFeatures,
  } from "../stores.js";

  let path = () => {};
  let boundaries = [];
  let data = [];
  let randomSite = [];
  let width, height;
  let polygons;

  onMount(async function () {
    boundaries = mesh(
      $countryFeatures,
      $countryFeatures.objects[$country],
      (a, b) => a !== b
    );
    const { features } = feature(
      $countryFeatures,
      $countryFeatures.objects[$country]
    );

    const mapSettings = getMapSettings({
      json: $countryFeatures,
      country: $country,
    });

    const { projection } = mapSettings;
    width = mapSettings.width;
    height = mapSettings.height;

    path = geoPath().projection(projection);

    features.sort((a, b) => ascending(path.area(a), path.area(b)));
    data = features;

    const sites = data.map((d) => path.centroid(d));

    const diagram = Delaunay.from(sites);
    const voronoi = diagram.voronoi([0, 0, width, height]);
    const cells = voronoi.cellPolygons(); // an iterator
    polygons = Array.from(voronoi.cellPolygons());
    detectNeighbors({ polygons, voronoi, colour: $colourScale });

    // start on random number
    // const start = Math.floor(Math.random() * sites.length);

    // or start by the smaller polygon
    const start = 0;

    randomSite = sites[start];

    const ranges = $binsData
      .map((bin, idx) => {
        return {
          value: $binsData[idx].length,
          range: [$binsData[idx].x0, $binsData[idx].x1],
        };
      })
      .filter((d) => {
        return d.value > 0;
      })
      .sort((b, a) => a.value - b.value);

    const totalRanges = sum(ranges, (d) => d.value);
    ranges.forEach((range) => {
      range.percent = Number(((range.value / totalRanges) * 100).toFixed(2));
      range.nFeatures = Math.floor((range.percent / 100) * features.length);
    });

    let rangeIndex = 0;
    let featuresAssigned = 0;
    let outOfRange;
    let queue = [];
    let value = 0;

    queue.push(start);
    for (let i = 0; i < queue.length; i++) {
      polygons[queue[i]].neighbors.forEach(function (e, j) {
        if (polygons[e] && !polygons[e].used) {
          const country = features[polygons[e].index];
          const { range, nFeatures } = ranges[rangeIndex];
          value = Math.random() * (range[1] - range[0]) + range[0]; // random number in given range

          country.properties.value = value;

          featuresAssigned++;
          if (featuresAssigned >= nFeatures) {
            rangeIndex++;
            featuresAssigned = 0;
          }

          ++outOfRange || null;

          // we can't treat features as decimal so it is possible that a few polygons get out of range
          // so we started the count from scratch using random number
          if (rangeIndex >= ranges.length) {
            // rangeIndex = Math.floor(Math.random() * ranges.length - 1) + 1;
            rangeIndex = ranges.length - 2;
            outOfRange = 0;
          }
          polygons[e].used = 1;
          queue.push(e);
        }
      });
    }
    console.log(`${outOfRange} features out of range`);
    // setCountryName.call(this, name);
  });

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

  function detectNeighbors(settings) {
    const { polygons, voronoi, colour } = settings;

    // push neighbors indexes to each polygons element
    polygons.map(function (d, i) {
      d.index = i; // index of this element
      d.high = 0;

      const neighbors = Array.from(voronoi.neighbors(d.index));
      d.neighbors = neighbors;
    });
  }
</script>

<div class="map">
  <svg {width} {height}>
    {#each data as feature}
      <path
        id="map-path-{feature.properties.index}"
        d={path(feature)}
        on:click={() => console.log(feature.properties.value)}
        fill={$colourScale(feature.properties.value)}
        stroke={$colourScale(feature.properties.value)}
        class="polygon"
      />
    {/each}
    <path id="boundaries" d={path(boundaries)} />
    <circle id="start-point" r="3" cx={randomSite[0]} cy={randomSite[1]} />
  </svg>
  <!-- <div id="selected-country" /> -->
</div>
