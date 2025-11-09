import { describe, it } from 'node:test';
import assert from 'node:assert';
import GlobalRegistrator from '../../../lib/GlobalRegistrator.js';

const PROP1 = 'PROP1';

describe('LitElement', () => {
	it('Tests integration.', async () => {
		GlobalRegistrator.register();

		await import('./LitElementComponent.js');

		document.body.innerHTML = `<lit-element-component prop1="${PROP1}"></lit-element-component>`;

		const litElement = document.body.querySelector('lit-element-component')!;
		const shadowRoot = litElement.shadowRoot!;

		await new Promise((resolve) => setTimeout(() => resolve(null), 100));

		assert.strictEqual(
			document.body.innerHTML,
			`<lit-element-component prop1="${PROP1}"></lit-element-component>`
		);

		assert.strictEqual(shadowRoot.querySelector('span')!.innerText, PROP1);
		assert.strictEqual(window.getComputedStyle(shadowRoot.querySelector('span')!).color, 'green');
		assert.strictEqual(
			shadowRoot!.innerHTML
				.replace(/[\s]/gm, '')
				.replace(/<!--\?lit\$[0-9]+\$-->/gm, '<!--?lit$123456$-->'),
			`
			<!---->Some text
			<span><!--?lit$123456$-->${PROP1}</span>!
		`.replace(/[\s]/gm, '')
		);

		GlobalRegistrator.unregister();
	});
});
