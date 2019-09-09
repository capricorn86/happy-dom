import ScopedCSSCache from './css/ScopedCSSCache';

/**
 * Render settings for shadow root.
 */
export default class ShadowRootRenderOptions {
	public openShadowRootAndScopeCSS = false;
	public appendScopedCSSToHead = true;
	public cssCache = new ScopedCSSCache();
}
