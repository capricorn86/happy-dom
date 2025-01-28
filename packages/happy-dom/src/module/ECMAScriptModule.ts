import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './IModule.js';
import ECMAScriptModuleCompiler from './ECMAScriptModuleCompiler.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Location from '../location/Location.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './IECMAScriptModuleCompiledResult.js';
import ModuleFactory from './ModuleFactory.js';

/**
 * ECMAScript module.
 */
export default class ECMAScriptModule implements IModule {
	public readonly url: URL;
	public readonly [PropertySymbol.window]: BrowserWindow;
	readonly #source: string;
	#compiled: IECMAScriptModuleCompiledResult | null = null;
	#exports: { [k: string]: any } | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 * @param source Source code.
	 */
	constructor(window: BrowserWindow, url: URL | Location, source: string) {
		this[PropertySymbol.window] = window;
		this.url = <URL>url;
		this.#source = source;
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

		const asyncTaskManager = browserFrame[PropertySymbol.asyncTaskManager];
		const taskID = asyncTaskManager.startTask();

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

		asyncTaskManager.endTask(taskID);

		const exports = {};

		compiled.execute.call(window, {
			dynamicImport: this.#import.bind(this),
			imports,
			exports
		});

		this.#exports = exports;

		return exports;
	}

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @returns Promise.
	 */
	public async preload(): Promise<void> {
		const compiled = this.#compile();
		const modulePromises: Promise<IModule>[] = [];
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();

		if (!browserFrame) {
			return;
		}

		const asyncTaskManager = browserFrame[PropertySymbol.asyncTaskManager];
		const taskID = asyncTaskManager?.startTask();

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

		asyncTaskManager.endTask(taskID);
	}

	/**
	 * Compiles the module.
	 */
	#compile(): IECMAScriptModuleCompiledResult {
		if (this.#compiled) {
			return this.#compiled;
		}

		const compiler = new ECMAScriptModuleCompiler(this[PropertySymbol.window]);

		this.#compiled = compiler.compile(this.url.href, this.#source);

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
			return;
		}

		const asyncTaskManager = browserFrame[PropertySymbol.asyncTaskManager];
		const taskID = asyncTaskManager?.startTask();
		const module = await ModuleFactory.getModule(window, this.url, url, options);
		const exports = await module.evaluate();

		asyncTaskManager.endTask(taskID);

		return exports;
	}
}
