import { toLowerCase, toUpperCase, trim } from './utilities/stringUtility.js';

/* eslint-disable no-undef */

/**
 * Module element.
 */
class TestModule extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.adoptedStyleSheets = [Style];
	}

	/**
	 * Connected callback.
	 */
	connectedCallback() {
		this.shadowRoot.innerHTML = `<div>
            Expect lower case: ${StringUtility.toLowerCase(Data.upperCase)}
            Expect upper case: ${toUpperCase(Data.lowerCase)}
            Expect lower case. ${toLowerCase(Data.upperCase)}
            Expect trimmed lower case: ${trim(Data.untrimmed)}
        </div>`;
	}
}

customElements.define('test-module', TestModule);
