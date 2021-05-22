import './LitElementComponent';

const PROP1 = 'PROP1';

describe('LitElementComponent', () => {
	beforeEach(() => {
		document.body.innerHTML = `<lit-element-component prop1="${PROP1}"></lit-element-component>`;
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('Tests integration.', () => {
		const shadowRoot = document.body.querySelector('lit-element-component').shadowRoot;

		expect(document.body.innerHTML).toBe(
			`<lit-element-component prop1="${PROP1}"></lit-element-component>`
		);

		expect(shadowRoot.querySelector('span').innerText).toBe(PROP1);
		expect(shadowRoot.innerHTML.replace(/[\s]/gm, '')).toBe(
			`
			<!---->Some text
			<span><!---->${PROP1}<!----></span>!
			<!---->
			<style>
				span {
					color: green;
				}
		    </style>
		`.replace(/[\s]/gm, '')
		);
	});
});
