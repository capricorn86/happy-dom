/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('lazyload.js');

const obj = { lazyloaded: true };

export const { lazyloaded } = obj;
