import { scaleLinear, scaleThreshold } from 'd3-scale';
import { extent, histogram, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

import computeBreaks from './compute-breaks';

export default function(div, data, column) {
  data.forEach(d => {
    d[column] = +d[column];
  });

  const scales = ['quantiles', 'equal breaks', 'jenks'];
  const breaks = computeBreaks(data, column);

  // TODO: config
  const SELECTED_SCALE = 'quantiles';
  const SELECTED_BINS = 40;

  // TODO: config
  const color = scaleThreshold()
    .range(['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'])
    .domain(breaks[SELECTED_SCALE]);

  const margin = { top: 20, right: 10, bottom: 20, left: 30 };
  const width =
    div.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  div
    .append('div')
    .attr('class', 'btn-group')
    .selectAll('button')
    .data(scales)
    .enter()
    .append('button')
    .attr('class', 'btn')
    .classed('active', d => d === SELECTED_SCALE)
    .text(d => d);

  const x = scaleLinear()
    .range([0, width])
    .domain(extent(data, d => d[column]));

  const bins = histogram()
    .domain(x.domain())
    .thresholds(x.ticks(SELECTED_BINS))(data.map(d => d[column]));

  const y = scaleLinear()
    .domain([0, max(bins, d => d.length)])
    .range([height, 0]);

  const svg = div
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const bar = svg
    .append('g')
    .attr('class', 'bars')
    .selectAll('.bar')
    .data(bins)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`);

  // FIXME: the color should be go *over* the bars
  bar
    .append('rect')
    .attr('width', x(bins[0].x1) - x(bins[0].x0))
    .attr('height', d => height - y(d.length))
    .attr('fill', d => (d ? color(max(d)) : '#ccc'));

  // Render break dividers
  svg
    .append('g')
    .attr('class', 'breaks')
    .selectAll('line')
    .data(breaks[SELECTED_SCALE])
    .enter()
    .append('line')
    .attr('x1', d => x(d))
    .attr('x2', d => x(d))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'black');

  svg
    .append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x));

  svg
    .append('g')
    .attr('class', 'axis y')
    .call(axisLeft(y).ticks(4));
}
