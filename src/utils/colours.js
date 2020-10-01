import {
  schemeBlues,
  schemeGreens,
  schemeGreys,
  schemeOranges,
  schemePurples,
  schemeBrBG,
  schemeBuGn,
  schemeBuPu,
  schemeGnBu,
  schemeOrRd,
  schemePuBuGn,
  schemePuRd,
  schemePiYG,
  schemePRGn,
  schemePuBu,
  schemePuOr,
  schemeRdBu,
  schemeRdYlBu,
  schemeRdYlGn,
  schemeRdGy,
  schemeSpectral,
  schemeYlGn,
  schemeYlGnBu,
  schemeYlOrBr,
  schemeYlOrRd,
} from "d3-scale-chromatic";

export default [
  {
    name: "Sequential (single hue)",
    scales: [
      {
        name: "Blues",
        scheme: schemeBlues,
      },
      {
        name: "Greens",
        scheme: schemeGreens,
      },
      {
        name: "Greys",
        scheme: schemeGreys,
      },
      {
        name: "Oranges",
        scheme: schemeOranges,
      },
      {
        name: "Purples",
        scheme: schemePurples,
      },
    ],
  },
  {
    name: "Sequential (multi-hue)",
    scales: [
      {
        name: "BuGn",
        scheme: schemeBuGn,
      },
      {
        name: "BuPu",
        scheme: schemeBuPu,
      },
      {
        name: "GnBu",
        scheme: schemeGnBu,
      },
      {
        name: "OrRd",
        scheme: schemeOrRd,
      },
      {
        name: "PuBuGn",
        scheme: schemePuBuGn,
      },
      {
        name: "PuBu",
        scheme: schemePuBu,
      },
      {
        name: "PuRd",
        scheme: schemePuRd,
      },
      {
        name: "YlGnBu",
        scheme: schemeYlGnBu,
      },
      {
        name: "YlGn",
        scheme: schemeYlGn,
      },
      {
        name: "YlOrBr",
        scheme: schemeYlOrBr,
      },
      {
        name: "YlOrRd",
        scheme: schemeYlOrRd,
      },
    ],
  },
  {
    name: "Diverging",
    scales: [
      {
        name: "BrBG",
        scheme: schemeBrBG,
      },
      {
        name: "PRGn",
        scheme: schemePRGn,
      },
      {
        name: "PiYG",
        scheme: schemePiYG,
      },
      {
        name: "PuOr",
        scheme: schemePuOr,
      },
      {
        name: "RdBu",
        scheme: schemeRdBu,
      },
      {
        name: "RdGy",
        scheme: schemeRdGy,
      },
      {
        name: "RdYlBu",
        scheme: schemeRdYlBu,
      },
      {
        name: "RdYlGn",
        scheme: schemeRdYlGn,
      },
      {
        name: "Spectral",
        scheme: schemeSpectral,
      },
    ],
  },
];
