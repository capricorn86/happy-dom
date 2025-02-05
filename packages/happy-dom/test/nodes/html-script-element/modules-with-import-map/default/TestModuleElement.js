import StringUtility from './utilities/StringUtilityClass.js';
import {
	toLowerCase,
	trim,
	toUpperCase,
	getData
} from 'external-scripts/utilities/stringUtility.js';
import Data from 'external-resources/json/data.json' with { type: 'json' };
import Style from 'external-resources/css/style.css' with { type: 'css' };

/* eslint-disable no-undef */

window['moduleLoadOrder'] = window['moduleLoadOrder'] || [];
window['moduleLoadOrder'].push('TestModuleElement.js');

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
            Additional expect lower case. ${toLowerCase(getData().upperCase)}
        </div>`;
		this.lazyLoad();
	}

	/**
	 * Lazy load.
	 */
	async lazyLoad() {
		const { lazyloaded } = await import('./utilities/lazyload.js');
		const div = document.createElement('div');
		div.innerHTML = `Lazy-loaded module: ${lazyloaded}`;
		this.shadowRoot.appendChild(div);
	}
}

customElements.define('test-module', TestModule);
