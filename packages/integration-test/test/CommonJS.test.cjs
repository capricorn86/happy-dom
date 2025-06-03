const assert = require('node:assert');
const { describe, it } = require('node:test');

describe('CommonJS', () => {
	it('Tests CommonJS integration.', () => {
		const { Window } = require('happy-dom');
		const window = new Window();
		const document = window.document;

		const element = document.createElement('div');
		element.innerHTML = 'Test';

		document.body.appendChild(element);

		assert.strictEqual(document.body.innerHTML, '<div>Test</div>');
	});
});
