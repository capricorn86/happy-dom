import ShadowRoot from '../src/nodes/shadow-root/ShadowRoot.js';
import HTMLElement from '../src/nodes/html-element/HTMLElement.js';

/**
 * CustomElement test class.
 */
export default class CustomElement extends HTMLElement {
	public static observedAttributesCallCount = 0;
	public static shadowRootMode = 'open';
	public static serializable = false;
	public changedAttributes: Array<{
		name: string;
		oldValue: string | null;
		newValue: string | null;
	}> = [];
	public isDisconnected = false;
	private internalShadowRoot: ShadowRoot;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.internalShadowRoot = this.attachShadow({
			mode: <'open'>CustomElement.shadowRootMode,
			serializable: CustomElement.serializable
		});

		// Test to create a node while constructing this node.
		this.ownerDocument.createElement('div');
	}

	/**
	 * Returns a list of observed attributes.
	 *
	 * @returns Observered attributes.
	 */
	public static get observedAttributes(): string[] {
		this.observedAttributesCallCount++;
		return ['key1', 'key2'];
	}

	/**
	 * @override
	 */
	public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		this.changedAttributes.push({ name, oldValue, newValue });
	}

	/**
	 * @override
	 */
	public connectedCallback(): void {
		this.internalShadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
                }
                span {
                    color: pink;
                }
				.propKey {
					color: yellow;
				}
            </style>
            <div>
                <span class="propKey">
                    key1 is "${this.getAttribute('key1')}" and key2 is "${this.getAttribute(
											'key2'
										)}".
                </span>
                <span class="children">${Array.from(this.childNodes)
									.map(
										(child) =>
											'#' + child['nodeType'] + (child['tagName'] || '') + child.textContent
									)
									.join(', ')}</span>
                <span><slot></slot></span>
            </div>
        `;
	}

	/**
	 * @override
	 */
	public disconnectedCallback(): void {
		this.isDisconnected = true;
	}
}
