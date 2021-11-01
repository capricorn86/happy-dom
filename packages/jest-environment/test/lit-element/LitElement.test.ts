import LitElementComponent from './LitElementComponent';
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
		const litElement = <LitElementComponent>document.body.querySelector('lit-element-component');
		const shadowRoot = litElement.shadowRoot;

		expect(document.body.innerHTML).toBe(
			`<lit-element-component prop1="${PROP1}"></lit-element-component>`
		);

		expect(shadowRoot.querySelector('span').innerText).toBe(PROP1);
		expect(
			shadowRoot.innerHTML
				.replace(/[\s]/gm, '')
				.replace(/<!--\?lit\$[0-9]+\$-->/gm, '<!--?lit$123456$-->')
		).toBe(
			`
			<!---->Some text
			<span><!--?lit$123456$-->${PROP1}</span>!
			<style>
				span {
					color: green;
				}
		    </style>
		`.replace(/[\s]/gm, '')
		);
	});
});
