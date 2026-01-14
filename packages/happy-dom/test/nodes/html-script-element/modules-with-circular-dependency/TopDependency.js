import { circularFunction } from './CircularDependency.js';

export function topFunction() {
	return 'topFunction() called';
}

export { circularFunction };
