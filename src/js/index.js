import { select, event } from 'd3-selection';
import { csvParse } from 'd3-dsv';
import sampleData from './sample';

const data = csvParse(sampleData);
const app = select('#app');
const form = app.select('.data-input form');

form
  .on('drag dragstart dragend dragover dragenter dragleave drop', () => {
    event.preventDefault();
    event.stopPropagation();
  })
  .on('dragover dragenter', () => {
    form.classed('is-dragover', true);
  })
  .on('dragleave dragend drop', () => {
    form.classed('is-dragover', false);
  })
  .on('drop', () => {
    const droppedFiles = event.originalEvent.dataTransfer.files;
    console.log(droppedFiles);
  });

const div = app
  .select('.data-output')
  .selectAll('div')
  .data(data)
  .enter();

div.append('div').html(d => `${d.id}: ${d.value}`);
