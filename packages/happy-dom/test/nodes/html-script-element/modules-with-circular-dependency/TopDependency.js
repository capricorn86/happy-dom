// eslint-disable-next-line import/no-cycle
import { circularFunction } from './CircularDependency.js';

export function topFunction() {
	return 'topFunction() called';
}

export { circularFunction };
