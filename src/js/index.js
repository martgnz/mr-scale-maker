import { select } from 'd3-selection';
import { csvParse } from 'd3-dsv';
import sampleData from './sample';

const data = csvParse(sampleData);
const app = select('#app');

const div = app
  .select('.data-output')
  .selectAll('div')
  .data(data)
  .enter();

div.append('div').html(d => `${d.id}: ${d.value}`);
