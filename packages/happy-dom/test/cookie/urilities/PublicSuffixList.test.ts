import { describe, expect, it } from 'vitest';
import CookieDomainUtility from '../../../src/cookie/urilities/CookieDomainUtility.js';

describe('PublicSuffixList', () => {
	describe('isPublicSuffix()', () => {
		it.each([
			['com', true],
			['co.uk', true],
			['github.io', true],
			['example.com', false],
			['example.co.uk', false],
			['example.github.io', false],
			['foo.ck', true],
			['www.ck', false],
			['sub.foo.ck', false],
			['sub.www.ck', false],
			['xn--55qx5d.cn', true],
			['unknown-tld', true],
			['example.unknown-tld', false]
		])('Matches bundled public suffix rules for %s.', (domain, expected) => {
			expect(CookieDomainUtility.isPublicSuffix(domain)).toBe(expected);
		});
	});
});
