import * as NodeFetch from 'node-fetch';
import IHeaders from './IHeaders';

/**
 * Fetch headers.
 */
export default class Headers extends NodeFetch.Headers implements IHeaders {}
