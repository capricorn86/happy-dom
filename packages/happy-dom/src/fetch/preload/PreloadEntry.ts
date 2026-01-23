import Response from '../Response.js';

/**
 * Preload entry.
 *
 * @see https://html.spec.whatwg.org/multipage/links.html#preload-entry
 */
export default class PreloadEntry {
	public integrityMetadata: string | null = null;
	public response: Response | null = null;
	public error: Error | null = null;
	#callback: {
		resolve: (response: Response) => void;
		reject: (error: Error) => void;
	} | null = null;

	/**
	 * On response available.
	 *
	 * @returns Response.
	 */
	public onResponseAvailable(): Promise<Response> {
		return new Promise((resolve, reject) => {
			this.#callback = { resolve, reject };
		});
	}

	/**
	 * Response available.
	 *
	 * @param error
	 * @param response
	 */
	public responseAvailable(error: Error | null, response: Response | null): void {
		this.response = response;
		this.error = error;

		if (!this.#callback) {
			return;
		}

		if (error) {
			this.#callback.reject(error);
		} else if (!response) {
			this.#callback.reject(new Error('Response is null'));
		} else {
			this.#callback.resolve(response);
		}
	}
}
