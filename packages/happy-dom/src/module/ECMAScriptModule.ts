import BrowserWindow from '../window/BrowserWindow.js';
import { URL } from 'url';
import IModule from './types/IModule.js';
import ECMAScriptModuleCompiler from './ECMAScriptModuleCompiler.js';
import * as PropertySymbol from '../PropertySymbol.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './types/IECMAScriptModuleCompiledResult.js';
import ModuleFactory from './ModuleFactory.js';
import IECMAScriptModuleInit from './types/IECMAScriptModuleInit.js';

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
	#evaluateQueue: Array<(value: { [key: string]: any }) => void> | null = null;

	/**
	 * Constructor.
	 *
	 * @param init Initialization options.
	 */
	constructor(init: IECMAScriptModuleInit) {
		this[PropertySymbol.window] = init.window;
		this.url = <URL>init.url;
		this.#source = init.source;
		this.#sourceURL = init.sourceURL || null;
	}

	/**
	 * Compiles and evaluates the module.
	 *
	 * @param [parentUrls] Parent modules URLs to detect circular imports.
	 * @param [circularResolver] Resolver for circular imports.
	 * @returns Module exports.
	 */
	public async evaluate(
		parentUrls: string[] = [],
		circularResolver: (() => void) | null = null
	): Promise<{ [key: string]: any }> {
		if (this.#evaluateQueue) {
			// Circular import detected
			if (parentUrls.includes(this.url.href)) {
				if (circularResolver) {
					// Reloads imports after circular import is resolved
					this.#evaluateQueue!.push(circularResolver);
				}
				return this.#exports!;
			}
			return new Promise<{ [key: string]: any }>((resolve) => {
				this.#evaluateQueue!.push(resolve);
			});
		}

		if (this.#exports) {
			return this.#exports;
		}

		const compiled = this.#compile();
		const modulePromises: Promise<IModule>[] = [];
		const window = this[PropertySymbol.window];
		const browserFrame = new WindowBrowserContext(window).getBrowserFrame();
		const moduleFactory = new ModuleFactory(window, this.url);

		if (!browserFrame) {
			return {};
		}

		const exports: { [k: string]: any } = {};
		this.#exports = exports;
		this.#evaluateQueue = [];

		for (const moduleImport of compiled.imports) {
			modulePromises.push(
				moduleFactory.getModule(moduleImport.url, {
					with: { type: moduleImport.type }
				})
			);
		}

		const imports = new Map<string, { [key: string]: any }>();
		let circularImportResolver: (() => void) | null = null;
		const circularImportResolverCallback = (): void => {
			if (circularImportResolver) {
				circularImportResolver();
			}
		};

		if (modulePromises.length) {
			const modules = await Promise.all(modulePromises);
			const newParentUrls = [...parentUrls, this.url.href];

			for (const module of modules) {
				if (module instanceof ECMAScriptModule) {
					const exports = await module.evaluate(newParentUrls, circularImportResolverCallback);
					imports.set(module.url.href, exports);
				} else {
					const exports = await module.evaluate();
					imports.set(module.url.href, exports);
				}
			}
		}

		const href = this.url.href;

		compiled.execute({
			dispatchError: window[PropertySymbol.dispatchError].bind(window),
			dynamicImport: moduleFactory.importModule.bind(moduleFactory),
			importMeta: {
				url: href,
				resolve: (url: string) => new URL(url, href).href
			},
			imports,
			exports,
			addCircularImportResolver: (resolver: () => void) => (circularImportResolver = resolver)
		});

		const evaluateQueue = this.#evaluateQueue;

		this.#evaluateQueue = null;

		for (const resolve of evaluateQueue) {
			resolve(exports);
		}

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
		const moduleFactory = new ModuleFactory(window, this.url);

		if (!browserFrame) {
			return;
		}

		for (const moduleImport of compiled.imports) {
			modulePromises.push(
				moduleFactory.getModule(moduleImport.url, {
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

		return <IECMAScriptModuleCompiledResult>this.#compiled;
	}
}
