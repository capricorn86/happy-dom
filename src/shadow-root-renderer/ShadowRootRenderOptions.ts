import ScopedCSSCache from './css/ScopedCSSCache';

/**
 * Render settings for shadow root.
 */
export default class ShadowRootRenderOptions {
	public openShadowRoots = false;
	public appendScopedCSSToHead = true;
	public cssCache = new ScopedCSSCache();
}
