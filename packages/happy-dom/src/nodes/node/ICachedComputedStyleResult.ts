import type CSSPropertyManager from '../../css/declaration/property-manager/CSSPropertyManager.js';
import type ICachedResult from './ICachedResult.js';

export default interface ICachedComputedStyleResult extends ICachedResult {
	result: WeakRef<CSSPropertyManager> | null;
}
