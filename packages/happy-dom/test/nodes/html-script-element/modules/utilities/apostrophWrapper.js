/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('apostrophWrapper.js');

export const apostrophWrapper = (str) => `"${str}"`;
