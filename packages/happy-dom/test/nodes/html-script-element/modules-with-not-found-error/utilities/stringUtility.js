import { notFound } from './notFound.js';

export const toLowerCase = (str) => notFound(str.toLowerCase());

const toUpperCase = (str) => notFound(str.toUpperCase());
const trim = (str) => notFound(str.trim());

export { toUpperCase, trim };
