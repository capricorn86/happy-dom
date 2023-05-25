import Window from '../src/window/Window.js';
import IShadowRoot from '../src/nodes/shadow-root/IShadowRoot.js';

/**
 * CustomElement test class.
 */
export default class CustomElement extends new Window().HTMLElement {
	public static observedAttributesCallCount = 0;
	public static shadowRootMode = 'open';
	public changedAttributes = [];
	private internalShadowRoot: IShadowRoot = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.internalShadowRoot = this.attachShadow({ mode: CustomElement.shadowRootMode });
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
                <span class="children">${this.childNodes
									.map(
										(child) =>
											'#' + child['nodeType'] + (child['tagName'] || '') + child.textContent
									)
									.join(', ')}</span>
                <span><slot></slot></span>
            </div>
        `;
	}
}
