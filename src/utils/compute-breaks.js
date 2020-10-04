import { scaleQuantile, scaleQuantize } from "d3-scale";
import { range, extent, median, mean } from "d3-array";
import {
  equalIntervalBreaks,
  ckmeans,
  mode,
  standardDeviation,
} from "simple-statistics";

export default function (classes, data) {
  const breaks = {};

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

  const equalBreaks = equalIntervalBreaks(data, classes + 1)
    .slice(1)
    .slice(0, -1);

  const ckmeansBreaks = ckmeans(data, classes + 1);

  const medians = median(data);
  const means = mean(data);
  const modes = mode(data);
  const stdDeviation = standardDeviation(data);

  // https://github.com/simple-statistics/simple-statistics/blob/4db0dd820ebb5bc9bd7635715a3ef8a4678e180e/CHANGELOG.md#jenks---ckmeans
  breaks.ckmeans = ckmeansBreaks.map((cluster) => cluster[0]).slice(1);

  breaks["equal breaks"] = equalBreaks;
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
