import { select, event } from 'd3-selection';
import { csvParse } from 'd3-dsv';
// import sampleData from './sample';

// const data = csvParse(sampleData)
const app = select('#app');
const form = app.select('.data-input form');
const output = app.select('.data-output');

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

  if (file.type.match('text.*')) {
    reader.readAsText(file);

    reader.onload = () => {
      displayFile(reader.result);
    };
  }

  form.classed('is-dragover', false);
}

function displayFile(input) {
  const data = csvParse(input);

  output.text(JSON.stringify(data));
}
