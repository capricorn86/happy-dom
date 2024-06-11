import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';

/**
 * Custom element test class.
 */
export default class CustomElementWithNamedSlots extends HTMLElement {
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
                <span><slot name="slot1"></slot></span>
                <span><slot name="slot2"></slot></span>
                <span><slot></slot></span>
            </div>
        `;
	}
}
