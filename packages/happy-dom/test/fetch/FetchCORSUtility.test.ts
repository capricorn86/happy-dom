import { describe, expect, it } from 'vitest';
import FetchCORSUtility from '../../src/fetch/utilities/FetchCORSUtility.js';

describe('FetchCORSUtility', () => {
	describe('isCORS()', () => {
		it('Treats requests to a different port as cross-origin.', () => {
			expect(FetchCORSUtility.isCORS('http://localhost:1234', 'http://localhost:9876')).toBe(true);
		});

		it('Treats a parent domain as cross-origin from its subdomain.', () => {
			expect(FetchCORSUtility.isCORS('http://sub.some.host', 'http://some.host')).toBe(true);
		});
	});
});
