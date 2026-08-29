import { GlobalWindow, PropertySymbol } from 'happy-dom';
import type { IOptionalBrowserSettings } from 'happy-dom';

const IGNORE_LIST = ['constructor', 'undefined', 'NaN', 'global', 'globalThis'];

/**
 * Safely gets a property value from a descriptor, handling getters that may throw.
 *
 * This is needed for forward compatibility with Node 26+ where localStorage/sessionStorage
 * will throw SecurityError when accessed without the --localstorage-file flag.
 *
 * Background:
 * - Node 25.2.0 introduced spec-compliant throwing behavior for localStorage
 * - Node 25.2.1 reverted this due to ecosystem impact (too breaking for semver-minor)
 * - The throwing behavior is planned to return in Node 26.0.0
 *
 * @see https://nodejs.org/en/blog/release/v25.2.1
 * @see https://github.com/capricorn86/happy-dom/issues/1950
 * @param descriptor Property descriptor.
 * @returns Object with value and whether accessing it threw an error.
 */
function safeGetPropertyValue(descriptor: PropertyDescriptor | undefined): {
	value: unknown;
	threw: boolean;
} {
	if (!descriptor) {
		return { value: undefined, threw: false };
	}

	// If it has a getter, try to invoke it safely
	if (descriptor.get) {
		try {
			return { value: descriptor.get.call(globalThis), threw: false };
		} catch {
			// Getter threw (e.g., Node 26+ localStorage without --localstorage-file)
			return { value: undefined, threw: true };
		}
	}

	return { value: descriptor.value, threw: false };
}

/**
 *
 */
export default class GlobalRegistrator {
	static #registered: { [key: string | symbol]: PropertyDescriptor | null } | null = null;

	/**
	 * Returns the registered state.
	 *
	 * @returns Registered state.
	 */
	public static get isRegistered(): boolean {
		return this.#registered !== null;
	}

	/**
	 * Registers Happy DOM globally.
	 *
	 * @param [options] Options.
	 * @param [options.width] Window width. Defaults to "1024".
	 * @param [options.height] Window height. Defaults to "768".
	 * @param [options.url] URL.
	 * @param [options.settings] Settings.
	 */
	public static register(options?: {
		width?: number;
		height?: number;
		url?: string;
		settings?: IOptionalBrowserSettings;
	}): void {
		if (this.#registered !== null) {
			throw new Error('Failed to register. Happy DOM has already been globally registered.');
		}

		const window = new GlobalWindow({ ...options, console: globalThis.console });

		this.#registered = {};

		// Define properties on the global object
		const propertyDescriptors = Object.getOwnPropertyDescriptors(window);

		for (const key of Object.keys(propertyDescriptors)) {
			if (!IGNORE_LIST.includes(key)) {
				const windowPropertyDescriptor = propertyDescriptors[key];
				const globalPropertyDescriptor = Object.getOwnPropertyDescriptor(globalThis, key);
				const { value: globalValue, threw: globalThrew } =
					safeGetPropertyValue(globalPropertyDescriptor);

				// Override if: no global value, values differ, OR accessing global threw an error
				// (e.g., Node 26+ localStorage/sessionStorage without --localstorage-file)
				if (
					globalValue === undefined ||
					globalThrew ||
					globalValue !== windowPropertyDescriptor.value
				) {
					this.#registered[key] = globalPropertyDescriptor || null;

					// If the property is the window object, replace it with the global object
					if (windowPropertyDescriptor.value === window) {
						(<any>window)[key] = globalThis;
						windowPropertyDescriptor.value = globalThis;
					}

					Object.defineProperty(globalThis, key, {
						...windowPropertyDescriptor,
						configurable: true
					});
				}
			}
		}

		// Define symbol properties on the global object
		const propertySymbols = Object.getOwnPropertySymbols(window);

		for (const key of propertySymbols) {
			const propertyDescriptor = Object.getOwnPropertyDescriptor(window, key);
			this.#registered[key] = null;

			// If the property is the window object, replace it with the global object
			if (propertyDescriptor!.value === window) {
				(<any>window)[key] = globalThis;
				propertyDescriptor!.value = globalThis;
			}

			Object.defineProperty(globalThis, key, {
				...propertyDescriptor,
				configurable: true
			});
		}

		// Set owner window on document to global
		(<any>globalThis).document[PropertySymbol.defaultView] = globalThis;
	}

	/**
	 * Closes the window and unregisters Happy DOM from being global.
	 */
	public static async unregister(): Promise<void> {
		if (this.#registered === null) {
			throw new Error(
				'Failed to unregister. Happy DOM has not previously been globally registered.'
			);
		}

		const happyDOM = (<any>globalThis).happyDOM;

		for (const key of Object.keys(this.#registered)) {
			if (this.#registered[key] !== null) {
				Object.defineProperty(globalThis, key, this.#registered[key]);
			} else {
				delete (<any>globalThis)[key];
			}
		}

		this.#registered = null;

		if (happyDOM) {
			await happyDOM.close();
		}
	}
}
