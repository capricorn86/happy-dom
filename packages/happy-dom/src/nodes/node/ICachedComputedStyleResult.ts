import type CSSStyleDeclarationPropertyManager from '../../css/declaration/property-manager/CSSStyleDeclarationPropertyManager.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedComputedStyleResult extends ICachedResult {
	result: WeakRef<CSSStyleDeclarationPropertyManager> | null;
}
