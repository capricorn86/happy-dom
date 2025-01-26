import PreloadedResponseStateEnum from './PreloadedResponseStateEnum.js';
import Response from './Response.js';

/**
 * Preloaded response using <link rel="preload">.
 */
export default class PreloadedResponse {
	public readonly options: { crossOrigin: 'anonymous' | 'use-credentials' } = {
		crossOrigin: 'anonymous'
	};
	public state: PreloadedResponseStateEnum = PreloadedResponseStateEnum.loading;
	#response: Response | null = null;
	#hooks: Array<() => void> = [];

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.crossOrigin] Cross origin.
	 */
	constructor(options?: { crossOrigin?: string }) {
		if (options?.crossOrigin === 'use-credentials') {
			this.options.crossOrigin = 'use-credentials';
		}

		// TODO: Add support for "as" attribute
	}

	/**
	 * Consumes the preloaded response.
	 *
	 * @returns Promise.
	 */
	public async consume(): Promise<Response | null> {
		if (
			this.state === PreloadedResponseStateEnum.consumed ||
			this.state === PreloadedResponseStateEnum.invalid
		) {
			return null;
		}
		if (this.state === PreloadedResponseStateEnum.loaded) {
			this.state = PreloadedResponseStateEnum.consumed;
			const response = this.#response;
			this.#response = null;
			return response;
		}
		await new Promise<void>((resolve) => {
			this.#hooks.push(resolve);
		});
		return this.consume();
	}

	/**
	 * Invalidates the preload response.
	 */
	public invalidate(): void {
		this.state = PreloadedResponseStateEnum.invalid;
		this.#response = null;
		this.#hooks = [];
	}

	/**
	 * Compiles and preloads the module and its imports.
	 *
	 * @param response Response.
	 */
	public setResponse(response: Response): void {
		this.state = PreloadedResponseStateEnum.loaded;
		this.#response = response;
		const hooks = this.#hooks;
		this.#hooks = [];
		for (const hook of hooks) {
			hook();
		}
	}
}
