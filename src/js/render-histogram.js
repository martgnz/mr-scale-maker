import { scaleLinear } from 'd3-scale';
import { extent, histogram, max } from 'd3-array';
import { axisBottom } from 'd3-axis';

export default function(div, data, column) {
  data.forEach(d => {
    d[column] = +d[column];
  });

  const margin = { top: 20, right: 10, bottom: 20, left: 10 };
  const width =
    div.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const x = scaleLinear()
    .range([0, width])
    .domain(extent(data, d => d[column]));

  const bins = histogram()
    .domain(x.domain())
    .thresholds(x.ticks(20))(data.map(d => d[column]));

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
    .selectAll('.bar')
    .data(bins)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`);

  bar
    .append('rect')
    .attr('x', 1)
    .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr('height', d => height - y(d.length));

  bar
    .append('text')
    .attr('dy', '.75em')
    .attr('y', 6)
    .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
    .attr('text-anchor', 'middle')
    .text(d => d.length);

  svg
    .append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x));
}
