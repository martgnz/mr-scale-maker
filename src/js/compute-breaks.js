import { scaleQuantile } from 'd3-scale';
import { range, median, mean } from 'd3-array';

export default function(classes, data, column) {
  const breaks = {};

  const quantiles = scaleQuantile()
    .range(range(0, classes))
    .domain(data.map(d => d[column]))
    .quantiles();

  const medians = median(data.map(d => d[column]));
  const means = mean(data.map(d => d[column]));

  breaks.quantiles = quantiles;
  breaks.statistics = [
    {
      label: 'Median',
      value: medians,
    },
    {
      label: 'Mean',
      value: means,
    },
  ];

  return breaks;
}
