import { apostrophWrapper } from './apostrophWrapper.js';
import Data from 'second-external-resources/json/data.json' with { type: 'json' };

/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('stringUtility.js');

export const toLowerCase = (str) => apostrophWrapper(str.toLowerCase());

const toUpperCase = (str) => apostrophWrapper(str.toUpperCase());
const trim = (str) => apostrophWrapper(str.trim());
const getData = () => Data;

export { toUpperCase, trim, getData };
