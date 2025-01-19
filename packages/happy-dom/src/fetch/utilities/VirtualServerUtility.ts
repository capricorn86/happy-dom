import BrowserWindow from '../../window/BrowserWindow.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import Path from 'path';

/**
 * Virtual server utility.
 */
export default class VirtualServerUtility {
	/**
	 * Returns the filesystem path for a request URL if it matches a virtual server.
	 *
	 * @param window Window.
	 * @param requestURL Request URL.
	 */
	public static getFilepath(window: BrowserWindow, requestURL: string): string | null {
		const browserSettings = new WindowBrowserContext(window).getSettings();
		if (!browserSettings || !browserSettings.fetch.virtualServers) {
			return null;
		}
		for (const virtualServer of browserSettings.fetch.virtualServers) {
			let baseURL: URL;
			if (typeof virtualServer.url === 'string') {
				const url = new URL(
					virtualServer.url[virtualServer.url.length - 1] === '/'
						? virtualServer.url.slice(0, -1)
						: virtualServer.url,
					window.location.origin
				);
				if (requestURL.startsWith(url.href)) {
					baseURL = url;
				}
			} else if (virtualServer.url instanceof RegExp) {
				const match = requestURL.match(virtualServer.url);
				if (match) {
					baseURL = new URL(
						match[0][match[0].length - 1] === '/' ? match[0].slice(0, -1) : match[0],
						window.location.origin
					);
				}
			}
			if (baseURL) {
				const basePath = requestURL.slice(baseURL.href.length);
				const parts = basePath.split('/');
				const isDirectory = !parts[parts.length - 1].includes('.');
				const path = isDirectory ? basePath + '/index.html' : basePath;

				return Path.join(Path.resolve(virtualServer.directory), path);
			}
		}
		return null;
	}
}
