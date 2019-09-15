import VM from 'vm';
import AsyncWindow from './AsyncWindow';

/**
 * This class is used for rendering a script server side.
 */
export default class VMContext {
	private context: VM.Context = this.createContext();

	/**
	 * Returns route HTML.
	 *
	 * @param {object} options Options.
	 * @param {string} options.html HTML.
	 * @param {VM.Script} [options.script] Script.
	 * @param {string} [options.url] Page URL.
	 * @param {boolean} [options.openShadowRoots=false] Set to "true" to open up shadow roots.
	 * @return {Promise<string>} HTML.
	 */
	public async render(options: {
		html: string;
		script: VM.Script;
		url?: string;
		openShadowRoots: boolean;
	}): Promise<string> {
		return new Promise((resolve, reject) => {
			const window = this.context.window;
			const document = this.context.document;

			window
				.whenAsyncComplete()
				.then(resolve)
				.catch(reject);

			if (options.url) {
				window.location.href = options.url;
			}

			window.shadowRootRenderOptions.openShadowRoots = options.openShadowRoots === true;

			document.write(options.html);

			options.script.runInContext(this.context);
		});
	}

	/**
	 * Disposes the render.
	 */
	public dispose(): void {
		this.context.window.dispose();
		this.context.dispose();
	}

	/**
	 * Creates a context.
	 *
	 * @return {VM.Context} Context.
	 */
	private createContext(): VM.Context {
		const window = new AsyncWindow();
		const global = Object.assign({}, window, { window });
		return VM.createContext(global);
	}
}
