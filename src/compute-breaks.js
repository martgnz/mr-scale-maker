import { scaleQuantile } from "d3-scale";
import { range, median, mean } from "d3-array";
import { equalIntervalBreaks, ckmeans } from "simple-statistics";

export default function (classes, data) {
  const breaks = {};

  const quantiles = scaleQuantile()
    .range(range(0, classes + 1))
    .domain(data)
    .quantiles();

  const equalBreaks = equalIntervalBreaks(data, classes - 1);
  const ckmeansBreaks = ckmeans(data, classes);

  const medians = median(data);
  const means = mean(data);

  // https://github.com/simple-statistics/simple-statistics/blob/4db0dd820ebb5bc9bd7635715a3ef8a4678e180e/CHANGELOG.md#jenks---ckmeans
  breaks.ckmeans = ckmeansBreaks.map(function (cluster) {
    return cluster[0];
  });

  breaks["equal breaks"] = equalBreaks;
  breaks.quantiles = quantiles;
  breaks.statistics = [
    {
      label: "Median",
      value: medians,
    },
    {
      label: "Mean",
      value: means,
    },
  ];

  return breaks;
}
