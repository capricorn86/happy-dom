/* eslint-disable */

class CustomElement extends HTMLElement {
	static get observedAttributes() {
		return ['key1', 'key2'];
	}

	constructor() {
        super();
        this.changedAttributes = [];
		this.attachShadow({ mode: 'closed' });
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.changedAttributes.push(name);
	}

	connectedCallback() {
		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                div {
                    color: red;
                }
                .class1 {
                    color: blue;
                }
                .class1.class2 span {
                    color: green;
                }
                .class1[attr1="value1"] {
                    color: yellow;
                }
                [attr1="value1"] {
                    color: yellow;
                }
            </style>
            <div>
                <span>
                    Some text.
                </span>
            </div>
        `;
	}
}

customElements.define('custom-element', CustomElement);
