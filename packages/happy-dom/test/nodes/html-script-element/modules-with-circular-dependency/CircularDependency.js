// eslint-disable-next-line import/no-cycle
import { topFunction } from './TopDependency.js';

export function circularFunction() {
	return topFunction();
}
