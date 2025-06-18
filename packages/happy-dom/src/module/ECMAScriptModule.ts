import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './IModule.js';
import ECMAScriptModuleCompiler from './ECMAScriptModuleCompiler.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Location from '../location/Location.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './IECMAScriptModuleCompiledResult.js';
import ModuleFactory from './ModuleFactory.js';

const EMPTY_COMPILED_RESULT = { imports: [], execute: async () => {} };

/**
 * ECMAScript module.
 */
export default class ECMAScriptModule implements IModule {
	public readonly url: URL;
	public readonly [PropertySymbol.window]: BrowserWindow;
	readonly #source: string;
	readonly #sourceURL: string | null;
	#preloaded: boolean = false;
	#compiled: IECMAScriptModuleCompiledResult | null = null;
	#exports: { [k: string]: any } | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 * @param source Source code.
	 * @param [sourceURL] Source URL.
	 */
	constructor(
		window: BrowserWindow,
		url: URL | Location,
		source: string,
		sourceURL?: string | null
	) {
		this[PropertySymbol.window] = window;
		this.url = <URL>url;
		this.#source = source;
		this.#sourceURL = sourceURL || null;
	}

	/**
	 * Compiles and evaluates the module.
	 *
	 * @returns Module exports.
	 */
	public async evaluate(): Promise<{ [key: string]: any }> {
		if (this.#exports) {
			return this.#exports;
		}

		const compiled = this.#compile();
		const modulePromises: Promise<IModule>[] = [];
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return {};
		}

		for (const moduleImport of compiled.imports) {
			modulePromises.push(
				ModuleFactory.getModule(window, this.url, moduleImport.url, {
					with: { type: moduleImport.type }
				})
			);
		}

		const modules = await Promise.all(modulePromises);

		const imports = new Map<string, { [key: string]: any }>();

		for (const module of modules) {
			imports.set(module.url.href, await module.evaluate());
		}

		const exports = {};
		const href = this.url.href;

		this.#exports = exports;

		compiled.execute({
			dispatchError: window[PropertySymbol.dispatchError].bind(window),
			dynamicImport: this.#import.bind(this),
			importMeta: {
				url: href,
				resolve: (url: string) => new URL(url, href).href
			},
			imports,
			exports
		});

		return exports;
	}

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @returns Promise.
	 */
	public async preload(): Promise<void> {
		if (this.#preloaded) {
			return;
		}

		this.#preloaded = true;

		const compiled = this.#compile();
		const modulePromises: Promise<IModule>[] = [];
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return;
		}

		for (const moduleImport of compiled.imports) {
			modulePromises.push(
				ModuleFactory.getModule(window, this.url, moduleImport.url, {
					with: { type: moduleImport.type }
				})
			);
		}

		const modules = await Promise.all(modulePromises);

		const promises: Promise<void>[] = [];
		for (const module of modules) {
			promises.push(module.preload());
		}

		await Promise.all(promises);
	}

	/**
	 * Compiles the module.
	 */
	#compile(): IECMAScriptModuleCompiledResult {
		if (this.#compiled) {
			return this.#compiled;
		}

		// In case of an error, the compiled module will be empty.
		this.#compiled = EMPTY_COMPILED_RESULT;

		const compiler = new ECMAScriptModuleCompiler(this[PropertySymbol.window]);

		this.#compiled = compiler.compile(this.url.href, this.#source, this.#sourceURL);

		return this.#compiled;
	}

	/**
	 * Imports a module.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 * @param [options.with] With.
	 * @param [options.with.type] Type.
	 */
	async #import(
		url: string,
		options?: { with?: { type?: string } }
	): Promise<{ [key: string]: any }> {
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return {};
		}

		const asyncTaskManager = browserFrame[PropertySymbol.asyncTaskManager];
		const taskID = asyncTaskManager?.startTask();
		const module = await ModuleFactory.getModule(window, this.url, url, options);
		const exports = await module.evaluate();

		asyncTaskManager.endTask(taskID);

		return exports;
	}
}
