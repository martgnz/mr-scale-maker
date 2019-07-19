import { scaleQuantile } from 'd3-scale';
import { range, median, mean } from 'd3-array';
import { equalIntervalBreaks  } from 'simple-statistics'

export default function(classes, data, column) {
  const breaks = {};

  const mappedData = data.map(d => d[column]);

  const quantiles = scaleQuantile()
    .range(range(0, classes + 1))
    .domain(mappedData)
    .quantiles();

  const equalBreaks = equalIntervalBreaks(mappedData, classes - 1);

  const medians = median(mappedData);
  const means = mean(mappedData);

  breaks['equal breaks'] = equalBreaks;
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
