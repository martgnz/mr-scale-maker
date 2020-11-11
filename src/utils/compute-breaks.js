import { scaleQuantile, scaleQuantize } from "d3-scale";
import { range, extent, median, mean, deviation } from "d3-array";
import { ckmeans, mode } from "simple-statistics";

export default function (classes, data) {
  const breaks = {};

  // d3.range is not inclusive on the upper bound, so we increase it by one
  const classesRange = range(0, classes + 1);

  const quantiles = scaleQuantile()
    .range(classesRange)
    .domain(data)
    .quantiles();

  const quantize = scaleQuantize()
    .range(classesRange)
    .domain(extent(data))
    .thresholds();

  const quantizeNice = scaleQuantize()
    .range(classesRange)
    .domain(extent(data))
    .nice()
    .thresholds();

  // adding one more class because we'll remove the first break
  // which is always the first one of the extent
  const ckmeansBreaks = ckmeans(data, classes + 1);

  const medians = median(data);
  const means = mean(data);
  const modes = mode(data);
  const stdDeviation = deviation(data);

  // https://github.com/simple-statistics/simple-statistics/blob/4db0dd820ebb5bc9bd7635715a3ef8a4678e180e/CHANGELOG.md#jenks---ckmeans
  breaks.ckmeans = ckmeansBreaks.map((cluster) => cluster[0]).slice(1);

  breaks.quantiles = quantiles;
  breaks.quantize = quantize;
  breaks["quantize (nice)"] = quantizeNice;
  breaks.statistics = [
    {
      label: "median",
      value: medians,
    },
    {
      label: "mean",
      value: means,
    },
    {
      label: "mode",
      value: modes,
    },
  ];

  breaks.standardDeviation = stdDeviation;

  return breaks;
}
