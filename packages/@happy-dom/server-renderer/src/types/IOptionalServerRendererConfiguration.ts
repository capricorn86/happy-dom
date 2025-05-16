import type IOptionalBrowserSettings from 'happy-dom/lib/browser/types/IOptionalBrowserSettings.js';
import ServerRendererLogLevelEnum from './ServerRendererLogLevelEnum.js';
import IServerRendererItem from './IServerRendererItem.js';

export default interface IOptionalServerRendererConfiguration {
	/**
	 * Settings for the browser.
	 */
	browser?: IOptionalBrowserSettings;
	/**
	 * Log level for the server renderer.
	 */
	logLevel?: ServerRendererLogLevelEnum;
	/**
	 * Enables debugging. This will override "browser.debug.traceWaitUntilComplete".
	 */
	debug?: boolean;
	/**
	 * Enables inspector.
	 */
	inspect?: boolean;
	/**
	 * Output directory.
	 */
	outputDirectory?: string;
	/**
	 * Cache settings.
	 */
	cache?: {
		/**
		 * Directory for caching files.
		 */
		directory?: string;
		/**
		 * Disables caching.
		 */
		disable?: boolean;
	};
	/**
	 * Settings for the worker.
	 */
	worker?: {
		/**
		 * Disables the worker.
		 */
		disable?: boolean;
		/**
		 * Maximum concurrency for the worker.
		 */
		maxConcurrency?: number;
	};
	/**
	 * Settings for rendering.
	 */
	render?: {
		/**
		 * Maximum concurrency for rendering.
		 */
		maxConcurrency?: number;
		/**
		 * Timeout for rendering in milliseconds.
		 */
		timeout?: number;
		/**
		 * Use incognito context for rendering.
		 */
		incognitoContext?: boolean;
		/**
		 * Render shadow roots with the "serializable" option set to true.
		 */
		serializableShadowRoots?: boolean;
		/**
		 * Render all shadow roots, including those that are not serializable.
		 */
		allShadowRoots?: boolean;
		/**
		 * Tags to exclude from shadow root rendering.
		 */
		excludeShadowRootTags?: string[] | null;
		/**
		 * Disable polyfills used for unimplemented functionality.
		 */
		disablePolyfills?: boolean;
	};
	/**
	 * List of URLs to render.
	 */
	urls?: Array<string | IServerRendererItem> | null;
	/**
	 * Proxy server settings.
	 */
	server?: {
		serverURL?: string | null;
		targetOrigin?: string | null;
		renderCacheTime?: number;
	};
}
