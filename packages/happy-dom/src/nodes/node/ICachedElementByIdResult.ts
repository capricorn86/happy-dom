import type Element from '../element/Element.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedElementByIdResult extends ICachedResult {
	result: WeakRef<Element> | null;
}
