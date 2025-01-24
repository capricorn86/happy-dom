import BrowserWindow from '../../../window/BrowserWindow.js';
import { URL } from 'url';
import Module from './Module.js';
import * as PropertySymbol from '../../../PropertySymbol.js';
import EcmaScriptModuleParser from './EcmaScriptModuleParser.js';

/**
 * Dynamic import.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 */
export default class DynamicImport {
	private window: BrowserWindow;
	private parentModuleURL: URL | null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param [parentModuleURL] Parent module URL.
	 */
	constructor(window: BrowserWindow, parentModuleURL: URL | null = null) {
		this.window = window;
		this.parentModuleURL = parentModuleURL;
	}

	/**
	 * Import a module dynamically.
	 *
	 * @param url URL of the module.
	 * @param [options] Options.
	 * @param [options.with] With.
	 * @param [options.with.type] Type.
	 * @returns Promise.
	 */
	public async import(url: string, options?: { with?: { type?: string } }): Promise<Module> {
		const absoluteURL = this.parentModuleURL ? new URL(url, this.parentModuleURL) : new URL(url);
		const modules = this.window[PropertySymbol.modules];
		const type = options?.with?.type || 'ecmascript';

		if (type !== 'ecmascript' && type !== 'json' && type !== 'css') {
			throw new this.window.TypeError(
				`Failed to parse module "${absoluteURL.href}": Unkown type "${type}"`
			);
		}

		const module = modules[type].get(absoluteURL.href);

		if (module) {
			return module;
		}

		const response = await this.window.fetch(absoluteURL);
		const source = await response.text();
		const newModule = await this.parseModule(absoluteURL, type, source);

		modules[type].set(absoluteURL.href, newModule);

		return newModule;
	}

	/**
	 * Parse a module.
	 *
	 * @param url URL of the module.
	 * @param type Type of the module.
	 * @param source Source code of the module.
	 * @returns Module.
	 */
	public async parseModule(url: URL, type: string, source: string): Promise<Module> {
		switch (type) {
			case 'json':
				const jsonModule = new Module(this.window, url);
				jsonModule.type = 'json';
				try {
					jsonModule.exports.default = JSON.parse(source);
				} catch (error) {
					throw new this.window.TypeError(
						`Failed to parse "json" module "${url.href}": ${error.message}`
					);
				}
				return jsonModule;
			case 'css':
				const cssModule = new Module(this.window, url);
				const stylesheet = new this.window.CSSStyleSheet();
				stylesheet.replaceSync(source);
				cssModule.type = 'css';
				cssModule.exports.default = stylesheet;
				return cssModule;
			case 'ecmascript':
				const parser = new EcmaScriptModuleParser(this.window);
				const result = parser.parse(url.href, source);
				const module = new Module(this.window, url);
				const importMap = new Map<string, { [key: string]: any }>();

				for (const moduleImport of result.imports) {
					const module = await this.import(moduleImport.url, { with: { type: moduleImport.type } });
					importMap.set(moduleImport.url, module.exports);
					module.imports.set(moduleImport.url, module);
				}

				const dynamicImport = new DynamicImport(this.window, module.url);
				const dynamicImportFunction = async (
					url: string,
					options?: { with?: { type?: string } }
				): Promise<{ [key: string]: any }> => {
					const module = await dynamicImport.import(url, options);
					return module.exports;
				};

				module.exports = this.evaluateEcmascriptModule({
					dynamicImport: dynamicImportFunction,
					code: result.code,
					imports: importMap,
					exports: {}
				});

				return module;
			default:
				throw new this.window.TypeError(
					`Failed to parse module "${url.href}": Unkown type "${type}"`
				);
		}
	}

	/**
	 * Evaluate a JavaScript module.
	 *
	 * @param $happy_dom Happy DOM object.
	 * @param $happy_dom.dynamicImport Function to import a module.
	 * @param $happy_dom.code Code.
	 * @param $happy_dom.imports Imports.
	 * @param $happy_dom.exports Exports.
	 * @returns Exports.
	 */
	private evaluateEcmascriptModule(
		// eslint-disable-next-line
		$happy_dom: {
			dynamicImport: (
				url: string,
				options?: { with?: { type?: string } }
			) => Promise<{ [key: string]: any }>;
			code: string;
			imports: Map<string, { [key: string]: any }>;
			exports: { [key: string]: any };
		}
	): { [key: string]: any } {
		// eslint-disable-next-line
		this.window.eval.call({}, $happy_dom.code);
		// eslint-disable-next-line
		return $happy_dom.exports;
	}
}
