import { csvParse } from 'd3-dsv';
import sampleData from './sample';

const data = csvParse(sampleData);

console.log(data);
