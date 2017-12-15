import { scaleQuantile } from 'd3-scale';

export default function(data, column) {
  const breaks = {};

  const quantiles = scaleQuantile()
    .range([0, 1, 2, 3, 4])
    .domain(data.map(d => d[column]))
    .quantiles();

  breaks.quantiles = quantiles;

  return breaks;
}
