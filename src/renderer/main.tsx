import './assets/main.css';

import { render } from 'preact';
import App from './App';
import log from 'electron-log/renderer';

Object.assign(console, log.functions);

const main = document.getElementById('main');

if (!main) {
  throw new Error('Main element not found');
}

render(<App />, main);
