import VM from 'vm';
import { AsyncWindow } from 'happy-dom';
import HappyDOMServerRenderer from '../renderer/HappyDOMServerRenderer';
import HappyDOMServerRenderResult from '../renderer/HappyDOMServerRenderResult';

/**
 * This class is used for rendering a script server side.
 */
export default class HappyDOMContext {
	private window: AsyncWindow = new AsyncWindow();

	/**
	 * Returns route HTML.
	 *
	 * @param options Options.
	 * @param options.html HTML.
	 * @param [options.scripts] Scripts.
	 * @param [options.url] Page URL.
	 * @param [options.customElements] Custom elements (web component) specific options.
	 * @param [options.customElements.openShadowRoots] Set to "true" to open up shadow roots.
	 * @param [options.customElements.extractCSS] Set to "true" to extract CSS when opening shadow roots.
	 * @param [options.customElements.scopeCSS] Set to "true" to enable scoping of CSS when opening shadow roots.
	 * @param [options.customElements.applyCSSToHead] Set to "true" to extract the CSS and add it to the document head.
	 * @return Render result.
	 */
	public async render({
		html = null,
		scripts = null,
		url = null,
		evaluateScripts = false,
		customElements = {
			openShadowRoots: false,
			extractCSS: false,
			scopeCSS: false,
			addCSSToHead: false
		}
	}: {
		html: string;
		scripts: VM.Script[];
		url?: string;
		evaluateScripts?: boolean;
		customElements?: {
			openShadowRoots: boolean;
			extractCSS: boolean;
			scopeCSS: boolean;
			addCSSToHead: boolean;
		};
	}): Promise<HappyDOMServerRenderResult> {
		return new Promise((resolve, reject) => {
			VM.createContext(this.window);

			// Functions are not an instanceof the "Function" class in the VM context, so therefore we set it to the used "Function" class.
			VM.runInContext('window.Function = (() => {}).constructor;', this.window);

			const window = this.window;
			const document = this.window.document;
			const renderer = new HappyDOMServerRenderer({
				openShadowRoots: customElements.openShadowRoots,
				extractCSS: customElements.extractCSS || customElements.addCSSToHead,
				scopeCSS: customElements.scopeCSS
			});

			if (!evaluateScripts) {
				global.eval = () => {};
			}

			window.happyDOM
				.whenAsyncComplete()
				.then(() => {
					if (customElements.addCSSToHead) {
						resolve(this.getResultWithCssAddedToHead(renderer.render(document)));
					} else {
						resolve(renderer.render(document));
					}
				})
				.catch(reject);

			if (url) {
				window.location.href = url;
			}

			if (scripts) {
				for (const script of scripts) {
					script.runInContext(this.window);
				}
			}

			document.open();
			document.write(html);
			document.close();
		});
	}

	/**
	 * Disposes the render.
	 */
	public dispose(): void {
		this.window.happyDOM.cancelAsync();
	}

	/**
	 * Returns a new result with CSS added as a style tag to the document head.
	 *
	 * @param result Result.
	 * @return New result.
	 */
	private getResultWithCssAddedToHead(
		result: HappyDOMServerRenderResult
	): HappyDOMServerRenderResult {
		const styleTag = `
			<style>
				${result.css.join('\n')}
			</style>
		`.trim();
		return {
			html: result.html.replace('</head>', `${styleTag}</head>`),
			css: result.css
		};
	}
}
