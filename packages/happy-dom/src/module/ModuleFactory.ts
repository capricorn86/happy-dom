import IModule from './types/IModule.js';
import * as PropertySymbol from '../PropertySymbol.js';
import CSSModule from './CSSModule.js';
import JSONModule from './JSONModule.js';
import UnresolvedModule from './UnresolvedModule.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import ResourceFetch from '../fetch/ResourceFetch.js';
import ECMAScriptModule from './ECMAScriptModule.js';
import BrowserWindow from '../window/BrowserWindow.js';
import IResourceFetchResponse from '../fetch/types/IResourceFetchResponse.js';
import ModuleURLUtility from './ModuleURLUtility.js';
import Location from '../location/Location.js';

/**
 * Module factory.
 */
export default class ModuleFactory {
	/**
	 * Fetches the source code of the module from the given URL and creates a new module instance.
	 *
	 * @param window Window.
	 * @param parentURL Parent URL.
	 * @param url Module URL.
	 * @param [parent] Parent module.
	 * @param [options] Options.
	 * @param [options.with] Options.
	 * @param [options.with.type] Module type.
	 */
	public static async getModule(
		window: BrowserWindow,
		parentURL: URL | Location,
		url: string,
		options?: { with?: { type?: string } }
	): Promise<IModule> {
		const absoluteURL = ModuleURLUtility.getURL(window, parentURL, url);
		const absoluteURLString = absoluteURL.href;
		const type = options?.with?.type || 'esm';

		if (type !== 'esm' && type !== 'css' && type !== 'json') {
			throw new window.TypeError(
				`Failed to import module "${absoluteURL}" from "${parentURL}": Unknown type "${type}"`
			);
		}

		const cached = <IModule>window[PropertySymbol.modules][type].get(absoluteURLString);

		if (cached) {
			if (cached instanceof UnresolvedModule) {
				await new Promise((resolve, reject) => {
					cached.addResolveListener(resolve, reject);
				});
				return <IModule>window[PropertySymbol.modules][type].get(absoluteURLString);
			}
			return cached;
		}
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			throw new window.TypeError(
				`Failed to import module "${absoluteURL}" from "${parentURL}": Window is closed and is no longer attached to a frame`
			);
		}

		const unresolvedModule = new UnresolvedModule({ window, url: absoluteURL });
		const readyStateManager = window[PropertySymbol.readyStateManager];

		const taskID = readyStateManager.startTask();

		window[PropertySymbol.modules][type].set(absoluteURLString, unresolvedModule);

		const resourceFetch = new ResourceFetch(window);
		let response: IResourceFetchResponse;
		try {
			response = await resourceFetch.fetch(absoluteURL, 'module');
		} catch (error) {
			readyStateManager.endTask(taskID);
			unresolvedModule.resolve(<Error>error);
			throw error;
		}

		readyStateManager.endTask(taskID);

		let module: IModule;

		switch (type) {
			case 'json':
				module = new JSONModule({ window, url: absoluteURL, source: response.content });
				break;
			case 'css':
				module = new CSSModule({ window, url: absoluteURL, source: response.content });
				break;
			case 'esm':
				module = new ECMAScriptModule({
					window,
					url: absoluteURL,
					source: response.content,
					sourceURL: response.virtualServerFile
				});
				break;
		}

		window[PropertySymbol.modules][type].set(absoluteURLString, module);

		unresolvedModule.resolve();

		return module;
	}
}
