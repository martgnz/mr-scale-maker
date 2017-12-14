import { scaleQuantile } from 'd3-scale';
import { extent } from 'd3-array';

export default function(data, column) {
  const breaks = {};

  const quantiles = scaleQuantile()
    .range([0, 1, 2, 3, 4])
    .domain(extent(data, d => d[column]))
    .quantiles();

  breaks.quantiles = quantiles;

  return breaks;
}
