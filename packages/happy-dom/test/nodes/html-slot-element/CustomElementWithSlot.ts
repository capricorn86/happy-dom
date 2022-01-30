import HTMLElement from '../../../src/nodes/html-element/HTMLElement';

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
		this.shadowRoot.innerHTML = `
            <div>
                <span><slot></slot></span>
            </div>
        `;
	}
}
