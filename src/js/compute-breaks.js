import { scaleQuantile } from 'd3-scale';
import { median, mean } from 'd3-array';

export default function(data, column) {
  const breaks = {};

  const quantiles = scaleQuantile()
    .range([0, 1, 2, 3, 4])
    .domain(data.map(d => d[column]))
    .quantiles();

  const medians = median(data.map(d => d[column]));
  const means = mean(data.map(d => d[column]));

  breaks.quantiles = quantiles;
  breaks.statistics = [
    {
      label: 'Median',
      value: medians
    },
    {
      label: 'Mean',
      value: means
    }
  ];

  return breaks;
}
