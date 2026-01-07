import { topFunction } from './TopDependency.js';

export function circularFunction() {
	return topFunction();
}
