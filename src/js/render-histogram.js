import { mouse } from 'd3-selection';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import { schemeRdPu } from 'd3-scale-chromatic';
import { bisector, extent, histogram, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';

import computeBreaks from './compute-breaks';

export default function(div, data, column) {
  data.forEach(d => {
    d[column] = +d[column];
  });

  const formatter = format('.1f');

  // TODO: config
  const scales = ['quantiles', 'equal breaks', 'ckmeans'];

  let SELECTED_SCALE = 'quantiles';
  const SELECTED_BINS = 20;

  const breaks = computeBreaks(SELECTED_CLASSES, data, column);

  // TODO: config
  const color = scaleThreshold()
    .range(schemeRdPu[SELECTED_CLASSES])
    .domain(breaks[SELECTED_SCALE]);

  const margin = { top: 60, right: 10, bottom: 20, left: 30 };
  const width =
    div.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  div
    .append('div')
    .attr('class', 'btn-group')
    .selectAll('button')
    .data(scales)
    .enter()
    .append('button')
    .attr('class', 'btn')
    .classed('active', d => d === SELECTED_SCALE)
    .text(d => d)
    .on('click', updateBreaks);

  const inputClasses = div.append('div').attr('class', 'input-classes');
  inputClasses.append('div').text('Classes');

  inputClasses
    .append('input')
    .attr('type', 'number')
    .attr('id', 'nClasses')
    .attr('min', 3)
    .attr('max', 9)
    .attr('value', SELECTED_CLASSES)
    .on('input', updateBreaks);

  // Start with the histogram
  const x = scaleLinear()
    .range([0, width])
    .domain(extent(data, d => d[column]));

  const bins = histogram()
    .domain(x.domain())
    .thresholds(x.ticks(SELECTED_BINS))(data.map(d => d[column]));

  const y = scaleLinear()
    .domain([0, max(bins, d => d.length)])
    .range([height, 0]);

  const bisectBins = bisector(d => d).right;
  const binsForBisector = bins.map(d => d.x0);

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
    .attr('fill', d => (d ? color(max(d)) : '#ccc'))
    .attr('stroke', d => (d ? color(max(d)) : '#ccc'));

  // Render break dividers
  const lines = svg
    .append('g')
    .attr('class', 'breaks')
    .selectAll('g')
    .data(breaks[SELECTED_SCALE])
    .enter()
    .append('g')
    .attr('class', 'break')
    .attr('transform', d => `translate(${Math.floor(x(d))}, 0)`);

  lines
    .append('line')
    .attr('y2', height)
    .attr('stroke', 'black');

  lines
    .append('text')
    .attr('dy', 9)
    .attr('dx', -4)
    .attr('text-anchor', 'end')
    .text(d => formatter(d));

  // Render statistical values
  const statistics = svg
    .append('g')
    .attr('class', 'statistics')
    .selectAll('g')
    .data(breaks.statistics)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${x(d.value)}, -30)`);

  statistics
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.label);

  statistics
    .append('text')
    .attr('dy', 12)
    .attr('text-anchor', 'middle')
    .text(d => formatter(d.value));

  statistics
    .append('text')
    .attr('dy', 23)
    .attr('text-anchor', 'middle')
    .text('▼');

  statistics
    .append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 30)
    .attr('y2', height + 30)
    .attr('stroke', 'purple')
    .attr('stroke-dasharray', '5 3');

  svg
    .append('g')
    .attr('class', 'axis x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisBottom(x));

  svg
    .append('g')
    .attr('class', 'axis y')
    .call(axisLeft(y).ticks(4));

  svg
    .append('rect')
    .attr('class', 'hover-rect')
    .attr('fill', 'transparent')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', mousemoved);

  function mousemoved() {
    const [xMouse] = mouse(svg.node());
    const idx = bisectBins(binsForBisector, x.invert(xMouse));

    const hover = {
      value: bins[idx].length,
      x0: bins[idx].x0,
    };

    console.log(hover.x0, hover.value);
  }

  function updateClasses(){
      SELECTED_CLASSES = +div.select('input').node().value
  }
  function updateScale(el){
      SELECTED_SCALE = el.innerText;
  }
  function handleActiveButton(el){
      div.selectAll(".btn").classed('active', false);
      el.classList.add('active');
  }

  function updateBreaks() {
    updateClasses();
    if (this.classList.contains('btn')) {
        handleActiveButton(this);
        updateScale(this);
    }
    const newBreaks = computeBreaks(SELECTED_CLASSES, data, column);
    const newColor = scaleThreshold()
      .range(schemeRdPu[SELECTED_CLASSES])
      .domain(newBreaks[SELECTED_SCALE]);

    svg
      .selectAll('.bar rect')
      .attr('fill', d => (d ? newColor(max(d)) : '#ccc'))
      .attr('stroke', d => (d ? newColor(max(d)) : '#ccc'));

    svg
      .selectAll('.break')
      .data(newBreaks[SELECTED_SCALE])
      .join(
        enter => {
          enter = enter
            .select('.breaks')
            .append('g')
            .attr('class', 'break')
            .attr('transform', d => `translate(${Math.floor(x(d))}, 0)`);

          enter
            .append('line')
            .attr('y2', height)
            .attr('stroke', 'black');

          enter
            .append('text')
            .attr('dy', 9)
            .attr('dx', -4)
            .attr('text-anchor', 'end')
            .text(d => formatter(d));
        },
        update => {
          update = update.attr(
            'transform',
            d => `translate(${Math.floor(x(d))}, 0)`,
          );

          update.select('text').text(d => formatter(d));
        },
      );
  }
}
