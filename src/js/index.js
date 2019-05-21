import Papa from 'papaparse';
import { select, selectAll, event } from 'd3-selection';
import { dsvFormat } from 'd3-dsv';

// eslint-disable-next-line no-unused-vars
import css from '../css/index.css';

import renderHistogram from './render-histogram';
import sample from './sample';

const app = select('#app');
const form = app.select('.data-input form');

const choose = app.select('#choose');
const output = choose.select('.output');

const visualize = app.select('#visualize');
const chart = visualize.select('.output');

const outputs = [];
outputs.push(choose, visualize);

let data;

form
  .on(
    'drag dragstart dragend.default dragover.default dragenter.default dragleave.default drop.default',
    () => {
      event.preventDefault();
      event.stopPropagation();
    },
  )
  .on('dragover dragenter', () => {
    form.classed('is-dragover', true);
  })
  .on('dragleave dragend drop', () => {
    form.classed('is-dragover', false);
  })
  .on('drop', dropped);

app.select('.demo-dataset').on('click', runDemo);

function dropped() {
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();

  // TODO: Print message if file is not accepted
  if (file.type.match('text.*')) {
    reader.readAsText(file);

    reader.onload = () => {
      clear();
      renderTable(reader.result);
    };
  }

  form.classed('is-dragover', false);
}

function runDemo() {
  clear();
  renderTable(sample);
}

function renderTable(input) {
  choose.classed('hidden', false);

  // Parse the dropped data
  data = parseData(input);

  // Based on Gregor Aisch's table implementation
  // https://www.vis4.net/blog/2015/04/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
  const table = output.append('table');

  table
    .append('thead')
    .append('tr')
    .selectAll('th')
    .data(data.columns)
    .enter()
    .append('th')
    .text(d => d)
    .on('click', paintColumn);

  table
    .append('tbody')
    .selectAll('tr')
    .data(data.slice(0, 5))
    .enter()
    .append('tr')
    .selectAll('td')
    .data(row =>
      data.columns.map(c => {
        const cell = {};
        cell[c] = row[c];
        return cell;
      }),
    )
    .enter()
    .append('td')
    .html(d => Object.values(d))
    .attr('class', d => (Number.isNaN(+Object.values(d)) ? 'string' : 'number'))
    .on('click', paintColumn);
}

function paintColumn(d) {
  // Hide chart output until we draw a new one
  visualize.classed('hidden', true);
  clear(chart);

  const isRow = select(this).node().nodeName === 'TD';
  const cellIndex = isRow && select(this).node().cellIndex;

  // If clicked on a row, get the key
  const c = isRow ? Object.keys(d)[0] : d;

  // First, reset the selected class
  selectAll('.checked').classed('checked', false);

  // Now, highlight the whole column
  if (isRow) {
    selectAll('th')
      .nodes()
      .filter(z => z.textContent === c)
      .forEach(e => e.classList.add('checked'));

    selectAll('td')
      .nodes()
      .filter(z => z.cellIndex === cellIndex)
      .forEach(e => e.classList.add('checked'));
  } else {
    select(this).classed('checked', true);
  }

  visualize.classed('hidden', false);

  if (!Number.isNaN(Number(data[0][c]))) {
    renderHistogram(chart, data, c);
  } else {
    const error = chart.append('div').attr('class', 'error');

    error.append('h3').text('Oops. Please select a column with numbers!');
    error
      .append('svg')
      .attr('width', 20)
      .attr('viewBox', '0 0 512 512')
      .append('path')
      .attr(
        'd',
        'M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z',
      );
  }
}

function parseData(input) {
  if (Array.isArray(input)) return input;

  const results = Papa.parse(input);
  const dsv = dsvFormat(results.meta.delimiter, 'utf-8');

  return dsv.parse(input);
}

function clear(el) {
  if (!el) {
    return outputs.forEach(d => {
      d.classed('hidden', true);
      d.select('.output').html('');
    });
  }
  return el.html('');
}
