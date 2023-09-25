import URL from '../../src/url/URL.js';
import Blob from '../../src/file/Blob.js';
import { Blob as NodeJSBlob } from 'buffer';
import { describe, it, expect } from 'vitest';

describe('URL', () => {
	describe('createObjectURL()', () => {
		it('Creates a string containing a URL representing the object given in the parameter.', () => {
			const blob = new Blob(['TEST']);
			expect(URL.createObjectURL(blob).startsWith('blob:nodedata:')).toBe(true);
		});

		it('Supports Node.js Blob objects.', () => {
			const blob = new NodeJSBlob(['TEST']);
			expect(URL.createObjectURL(blob).startsWith('blob:nodedata:')).toBe(true);
		});
	});
});
