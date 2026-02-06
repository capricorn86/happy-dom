import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import Window from '../../src/window/Window.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('XMLSerializer', () => {
	let window: Window;
	let xmlSerializer: XMLSerializer;

	beforeEach(() => {
		window = new Window();
		xmlSerializer = new XMLSerializer();
	});

	describe('Issue #1918: Non-breaking spaces should use numeric entity', () => {
		it('Encodes non-breaking spaces as &#160; instead of &nbsp;.', () => {
			// &nbsp; is not a valid XML entity, only &#160; or &#xA0; are valid
			const div = window.document.createElement('div');
			div.textContent = 'Hello\u00A0World';

			const result = xmlSerializer.serializeToString(div);

			expect(result).toContain('&#160;');
			expect(result).not.toContain('&nbsp;');
		});
	});
});
