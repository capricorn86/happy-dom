import type CSSPropertyManager from '../../css/declaration/property-manager/CSSPropertyManager.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedComputedStyleResult extends ICachedResult {
	result: WeakRef<CSSPropertyManager> | null;

	/**
	 * Every custom property computed on the element, inherited ones included. An invalid custom property is an empty string, so that it hides a value further up the tree.
	 */
	cssVariables?: { [k: string]: string };
}
