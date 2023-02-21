import { URL } from 'url';
import Event from '../../event/Event';
import ErrorEvent from '../../event/events/ErrorEvent';
import IWindow from '../../window/IWindow';
import Window from '../../window/Window';
import IDocument from '../document/IDocument';
import HTMLElement from '../html-element/HTMLElement';
import INode from '../node/INode';
import IFrameCrossOriginWindow from './IFrameCrossOriginWindow';
import IHTMLIFrameElement from './IHTMLIFrameElement';

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement.
 */
export default class HTMLIFrameElement extends HTMLElement implements IHTMLIFrameElement {
	// Events
	public onload: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;

	// Private
	#contentWindow: IWindow | IFrameCrossOriginWindow | null = null;

	/**
	 * Returns source.
	 *
	 * @returns Source.
	 */
	public get src(): string {
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets source.
	 *
	 * @param src Source.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns allow.
	 *
	 * @returns Allow.
	 */
	public get allow(): string {
		return this.getAttribute('allow') || '';
	}

	/**
	 * Sets allow.
	 *
	 * @param allow Allow.
	 */
	public set allow(allow: string) {
		this.setAttribute('allow', allow);
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): string {
		return this.getAttribute('height') || '';
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: string) {
		this.setAttribute('height', height);
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): string {
		return this.getAttribute('width') || '';
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: string) {
		this.setAttribute('width', width);
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns sandbox.
	 *
	 * @returns Sandbox.
	 */
	public get sandbox(): string {
		return this.getAttribute('sandbox') || '';
	}

	/**
	 * Sets sandbox.
	 *
	 * @param sandbox Sandbox.
	 */
	public set sandbox(sandbox: string) {
		this.setAttribute('sandbox', sandbox);
	}

	/**
	 * Returns srcdoc.
	 *
	 * @returns Srcdoc.
	 */
	public get srcdoc(): string {
		return this.getAttribute('srcdoc') || '';
	}

	/**
	 * Sets sandbox.
	 *
	 * @param srcdoc Srcdoc.
	 */
	public set srcdoc(srcdoc: string) {
		this.setAttribute('srcdoc', srcdoc);
	}

	/**
	 * Returns content document.
	 *
	 * @returns Content document.
	 */
	public get contentDocument(): IDocument | null {
		return (<IWindow>this.#contentWindow)?.document || null;
	}

	/**
	 * Returns content window.
	 *
	 * @returns Content window.
	 */
	public get contentWindow(): IWindow | IFrameCrossOriginWindow | null {
		return this.#contentWindow || null;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const isConnected = this.isConnected;
		const isParentConnected = parentNode ? parentNode.isConnected : false;

		super._connectToNode(parentNode);

		if (
			isParentConnected &&
			isConnected !== isParentConnected &&
			!this.ownerDocument.defaultView.happyDOM.settings.disableIframePageLoading
		) {
			const src = this.src;

			if (src !== null) {
				const contentWindow = new (<typeof Window>this.ownerDocument.defaultView.constructor)({
					url: src,
					settings: {
						...this.ownerDocument.defaultView.happyDOM.settings
					}
				});

				(<IWindow>contentWindow.parent) = this.ownerDocument.defaultView;
				(<IWindow>contentWindow.top) = this.ownerDocument.defaultView;

				if (src === 'about:blank') {
					this.#contentWindow = contentWindow;
					return;
				}

				if (src.startsWith('javascript:')) {
					this.#contentWindow = contentWindow;
					this.#contentWindow.eval(src.replace('javascript:', ''));
					return;
				}

				const originURL = this.ownerDocument.defaultView.location;
				const targetURL = new URL(src, originURL);
				const isCORS =
					(originURL.hostname !== targetURL.hostname &&
						!originURL.hostname.endsWith(targetURL.hostname)) ||
					originURL.protocol !== targetURL.protocol;

				const onError = (error): void => {
					this.dispatchEvent(
						new ErrorEvent('error', {
							message: error.message,
							error
						})
					);
					this.ownerDocument.defaultView.dispatchEvent(
						new ErrorEvent('error', {
							message: error.message,
							error
						})
					);
					if (
						!this['_listeners']['error'] &&
						!this.ownerDocument.defaultView['_listeners']['error']
					) {
						this.ownerDocument.defaultView.console.error(error);
					}
				};

				this.#contentWindow = null;
				this.ownerDocument.defaultView
					.fetch(src)
					.then((response) => {
						response
							.text()
							.then((text) => {
								this.#contentWindow = isCORS
									? new IFrameCrossOriginWindow(this.ownerDocument.defaultView, contentWindow)
									: contentWindow;
								contentWindow.document.write(text);
								this.dispatchEvent(new Event('load'));
							})
							.catch(onError);
					})
					.catch(onError);
			}
		}
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLIFrameElement {
		return <IHTMLIFrameElement>super.cloneNode(deep);
	}
}
