import { apostrophWrapper } from './apostrophWrapper.js';

/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('stringUtility.js');

export const toLowerCase = (str) => apostrophWrapper(str.toLowerCase());

const toUpperCase = (str) => apostrophWrapper(str.toUpperCase());
const trim = (str) => apostrophWrapper(str.trim());

export { toUpperCase, trim };
