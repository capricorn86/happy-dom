import type Element from '../element/Element.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedElementByTagNameResult extends ICachedResult {
	result: WeakRef<Element> | null;
}
