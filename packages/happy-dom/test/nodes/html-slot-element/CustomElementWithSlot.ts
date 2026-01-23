import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot.js';

/**
 * Custom element test class.
 */
export default class CustomElementWithSlot extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * @override
	 */
	public connectedCallback(): void {
		(<ShadowRoot>this.shadowRoot).innerHTML = `
            <div>
                <span><slot></slot></span>
            </div>
        `;
	}
}
