import { select, selectAll, event } from 'd3-selection';
import { dsvFormat } from 'd3-dsv';
import 'papaparse';

import renderHistogram from './render-histogram';

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
    }
  )
  .on('dragover dragenter', () => {
    form.classed('is-dragover', true);
  })
  .on('dragleave dragend drop', () => {
    form.classed('is-dragover', false);
  })
  .on('drop', dropped);

function dropped() {
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();

  // TODO: Print message if file is not accepted
  if (file.type.match('text.*')) {
    reader.readAsText(file);

    reader.onload = () => {
      clear();
      selectColumn(reader.result);
    };
  }

  form.classed('is-dragover', false);
}

function selectColumn(input) {
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
      })
    )
    .enter()
    .append('td')
    .html(d => Object.values(d))
    .on('click', paintColumn);
}

function paintColumn(d) {
  const isRow = select(this).node().nodeName === 'TD';
  const cellIndex = isRow && select(this).node().cellIndex;

  // If clicked on a row, get the key
  const c = isRow ? Object.keys(d)[0] : d;

  // Hide chart output until draw a new one
  visualize.classed('hidden', true);
  clear(chart);

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

  if (!Number.isNaN(Number(data[0][c]))) {
    visualize.classed('hidden', false);
    renderHistogram(chart, data, c);
  }
}

function parseData(input) {
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
