import { select, event } from 'd3-selection';
import { csvParse } from 'd3-dsv';
// import sampleData from './sample';

// const data = csvParse(sampleData)
const app = select('#app');
const form = app.select('.data-input form');

const choose = app.select('#choose');
const output = choose.select('.data-output');

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

function dropped() {
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();

  // TODO: Print message if file is not accepted
  if (file.type.match('text.*')) {
    reader.readAsText(file);

    reader.onload = () => {
      selectColumn(reader.result);
    };
  }

  form.classed('is-dragover', false);
}

function selectColumn(input) {
  choose.classed('hidden', false);

  // Parse the dropped data
  const data = csvParse(input);

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
    .text(d => d);

  table
    .append('tbody')
    .selectAll('tr')
    .data(data.slice(0, 10))
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
    .html(d => Object.values(d));
}
