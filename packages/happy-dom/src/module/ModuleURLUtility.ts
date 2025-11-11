import { URL } from 'url';
import * as PropertySymbol from '../PropertySymbol.js';
import BrowserWindow from '../window/BrowserWindow.js';
import Location from '../location/Location.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';

/**
 * Module URL utility.
 */
export default class ModuleURLUtility {
	/**
	 * Returns module URL based on parent URL and the import map.
	 *
	 * @param window Window.
	 * @param parentURL Parent URL.
	 * @param url Module URL.
	 */
	public static getURL(
		window: BrowserWindow,
		parentURL: URL | Location | string,
		url: string
	): URL {
		const settings = new WindowBrowserContext(window).getSettings();
		const parentURLString = typeof parentURL === 'string' ? parentURL : parentURL.href;
		const importMap = window[PropertySymbol.moduleImportMap];
		const resolved = settings?.module.urlResolver
			? settings?.module.urlResolver({ url, parentURL: parentURLString, window })
			: url;

		if (!importMap) {
			return new URL(resolved, parentURLString);
		}

		if (importMap.scopes.length) {
			for (const scope of importMap.scopes) {
				if (parentURLString.includes(scope.scope)) {
					for (const rule of scope.rules) {
						if (resolved.startsWith(rule.from)) {
							return new URL(rule.to + resolved.replace(rule.from, ''), parentURLString);
						}
					}
				}
			}
		}

		if (importMap.imports.length) {
			for (const rule of importMap.imports) {
				if (resolved.startsWith(rule.from)) {
					return new URL(rule.to + resolved.replace(rule.from, ''), parentURLString);
				}
			}
		}

		return new URL(resolved, parentURLString);
	}
}
