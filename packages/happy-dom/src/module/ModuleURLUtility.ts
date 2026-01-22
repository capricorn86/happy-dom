import { URL } from 'url';
import * as PropertySymbol from '../PropertySymbol.js';
import BrowserWindow from '../window/BrowserWindow.js';
import Location from '../location/Location.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import Path from 'path';
import FS from 'fs';
import IResolveNodeModules from './types/IResolveNodeModules.js';

const MAIN_FIELDS = ['module', 'main'];
const EXTENSIONS = ['.js', '.mjs'];

/**
 * Module URL utility.
 */
export default class ModuleURLUtility {
	private static nodeModuleResolveCache: Map<string, string> = new Map();
	private static packageJsonCache: Map<string, any> = new Map();

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
		const parentURLString = typeof parentURL === 'string' ? parentURL : parentURL.href;
		const importMap = window[PropertySymbol.moduleImportMap];
		const resolved = this.resolveURL(window, parentURLString, url);

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

	/**
	 * Clears the internal caches.
	 */
	public static clearCache(): void {
		this.nodeModuleResolveCache.clear();
		this.packageJsonCache.clear();
	}

	/**
	 * Resolves the module URL using the settings.
	 *
	 * @param window Window.
	 * @param parentURL Parent URL.
	 * @param url Module URL.
	 */
	private static resolveURL(window: BrowserWindow, parentURL: string, url: string): string {
		const settings = new WindowBrowserContext(window).getSettings();
		if (!settings) {
			return url;
		}
		let resolvedURL = url;
		if (settings.module.resolveNodeModules) {
			resolvedURL = this.resolveNodeModuleURL(settings.module.resolveNodeModules, url);
		}
		if (settings.module.urlResolver) {
			resolvedURL = settings.module.urlResolver({ url: resolvedURL, parentURL, window });
		}
		return resolvedURL;
	}

	/**
	 * Resolves node module URL.
	 *
	 * @param resolveNodeModules Settings for resolving node modules.
	 * @param url Module URL.
	 */
	private static resolveNodeModuleURL(
		resolveNodeModules: IResolveNodeModules,
		url: string
	): string {
		if (
			url[0] === '.' ||
			url[0] === '/' ||
			url.startsWith('http://') ||
			url.startsWith('https://')
		) {
			return url;
		}

		const slash = resolveNodeModules.url[resolveNodeModules.url.length - 1] === '/' ? '' : '/';
		const baseURL = `${resolveNodeModules.url}${slash}`;
		const nodeModulesDirectory = Path.resolve(resolveNodeModules.directory);
		const parts = url.split('/');
		const cached = this.nodeModuleResolveCache.get(url);

		if (cached) {
			return cached;
		}

		const packageName = url[0] === '@' ? `${parts[0]}/${parts[1]}` : parts[0];
		let packageJson = this.packageJsonCache.get(packageName);

		if (!packageJson) {
			try {
				packageJson = JSON.parse(
					FS.readFileSync(Path.join(nodeModulesDirectory, packageName, 'package.json'), 'utf-8')
				);
				this.packageJsonCache.set(packageName, packageJson);
			} catch {
				return url;
			}
		}

		if ((url[0] === '@' && parts.length === 2) || parts.length === 1) {
			if (packageJson.exports?.['.']?.import) {
				const resolvedURL = `${baseURL}${packageName}/${packageJson.exports['.'].import.replace('./', '')}`;
				this.nodeModuleResolveCache.set(url, resolvedURL);
				return resolvedURL;
			}

			const mainFields = resolveNodeModules.mainFields || MAIN_FIELDS;

			for (const field of mainFields) {
				if (
					packageJson[field] &&
					FS.existsSync(Path.join(nodeModulesDirectory, packageName, packageJson[field]))
				) {
					const resolvedURL = `${baseURL}${url}/${packageJson[field]}`;
					this.nodeModuleResolveCache.set(url, resolvedURL);
					return resolvedURL;
				}
			}

			return url;
		}

		const subPath = parts.slice(url[0] === '@' ? 2 : 1).join('/');

		if (packageJson.exports) {
			for (const key of Object.keys(packageJson.exports)) {
				const importEntry = Array.isArray(packageJson.exports[key].import)
					? packageJson.exports[key].import[0]
					: packageJson.exports[key].import;
				if (importEntry) {
					const regExp = new RegExp(
						`^${key.replace('./', '').replace(/\./g, '\\.').replace(/\*/g, '(.*)')}$`
					);
					const match = subPath.match(regExp);
					if (match) {
						const resolvedSubPath = importEntry.replace('./', '').replace('*', match[1]);
						const resolvedURL = `${baseURL}${packageName}/${resolvedSubPath}`;
						this.nodeModuleResolveCache.set(url, resolvedURL);
						return resolvedURL;
					}
				}
			}
		}

		if (!url.endsWith('.js') && !url.endsWith('.mjs')) {
			for (const ext of EXTENSIONS) {
				if (FS.existsSync(Path.join(nodeModulesDirectory, `${url}${ext}`))) {
					const resolvedURL = `${baseURL}${url}${ext}`;
					this.nodeModuleResolveCache.set(url, resolvedURL);
					return resolvedURL;
				}
			}
		} else {
			if (FS.existsSync(Path.join(nodeModulesDirectory, url))) {
				const resolvedURL = `${baseURL}${url}`;
				this.nodeModuleResolveCache.set(url, resolvedURL);
				return resolvedURL;
			}
		}

		return url;
	}
}
