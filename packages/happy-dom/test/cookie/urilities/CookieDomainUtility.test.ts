import { describe, expect, it } from 'vitest';
import CookieDomainUtility from '../../../src/cookie/urilities/CookieDomainUtility.js';

describe('CookieDomainUtility', () => {
	describe('validateDomain()', () => {
		it.each([
			['', 'example.com', ''],
			['.EXAMPLE.COM', 'sub.example.com', 'example.com'],
			['bücher.de', 'xn--bcher-kva.de', 'xn--bcher-kva.de'],
			['127.0.0.1', '127.0.0.1', '127.0.0.1'],
			['[::1]', '[::1]', '[::1]'],
			['0.1', '127.0.0.1', null],
			['example.com', 'notexample.com', null],
			['example.com.', 'example.com', null],
			['..example.com', 'example.com', null],
			['example.com/path', 'example.com', null],
			['com', 'example.com', null],
			['co.uk', 'example.co.uk', null],
			['github.io', 'example.github.io', null],
			['foo.ck', 'sub.foo.ck', null],
			['www.ck', 'sub.www.ck', 'www.ck'],
			['localhost', 'localhost', ''],
			['co.uk', 'co.uk', '']
		])('Validates "%s" for "%s".', (domain, host, expected) => {
			expect(CookieDomainUtility.validateDomain(domain, host)).toBe(expected);
		});
	});
});
