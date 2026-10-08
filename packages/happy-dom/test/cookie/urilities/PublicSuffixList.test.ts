import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import CookieDomainUtility from '../../../src/cookie/urilities/CookieDomainUtility.js';

const {
	parsePublicSuffixList
}: {
	parsePublicSuffixList: (content: string) => {
		exact: string[];
		wildcard: string[];
		exception: string[];
	};
} = createRequire(import.meta.url)('../../../bin/build-public-suffix-list.cjs');

const LIST = `// ===BEGIN ICANN DOMAINS===
com
co.uk
*.ck
!www.ck
公司.cn
// ===END ICANN DOMAINS===
// ===BEGIN PRIVATE DOMAINS===
github.io
// ===END PRIVATE DOMAINS===
`;

describe('PublicSuffixList', () => {
	describe('parsePublicSuffixList()', () => {
		it('Parses exact, wildcard, exception, private and internationalized rules.', () => {
			expect(parsePublicSuffixList(LIST)).toEqual({
				exact: ['com', 'co.uk', 'xn--55qx5d.cn', 'github.io'],
				wildcard: ['ck'],
				exception: ['www.ck']
			});
		});

		it.each([
			'<html>download failed</html>',
			LIST.replace('// ===END PRIVATE DOMAINS===', ''),
			LIST.replace('*.ck', ''),
			LIST.replace('!www.ck', ''),
			LIST.replace('co.uk', 'invalid..domain')
		])('Rejects malformed or incomplete data.', (content) => {
			expect(() => parsePublicSuffixList(content)).toThrow('Invalid Public Suffix List');
		});
	});

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
