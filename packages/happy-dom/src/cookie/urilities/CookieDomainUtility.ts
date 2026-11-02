import { isIP } from 'node:net';
import { domainToASCII } from 'node:url';
import PublicSuffixList from '../PublicSuffixList.js';

/**
 * Cookie domain validation.
 */
export default class CookieDomainUtility {
	/**
	 * Normalizes a domain attribute and validates it against the setting host.
	 *
	 * @param domain Domain attribute.
	 * @param hostname Setting host.
	 * @returns Domain, an empty string for host-only cookies, or null if invalid.
	 */
	public static validateDomain(domain: string, hostname: string): string | null {
		if (!domain) {
			return '';
		}

		const normalizedDomain = domain.startsWith('.') ? domain.slice(1) : domain;
		if (isIP(hostname.replace(/^\[|\]$/g, ''))) {
			return normalizedDomain.toLowerCase() === hostname ? hostname : null;
		}
		if (/[/\\:@?#%\s]/.test(normalizedDomain)) {
			return null;
		}

		const asciiDomain = domainToASCII(normalizedDomain).toLowerCase();
		if (
			!asciiDomain ||
			!/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*$/.test(asciiDomain) ||
			isIP(asciiDomain) ||
			!this.domainMatches(hostname, asciiDomain)
		) {
			return null;
		}

		if (this.isPublicSuffix(asciiDomain)) {
			// A public suffix can only set a host-only cookie for itself.
			return hostname === asciiDomain ? '' : null;
		}
		return asciiDomain;
	}

	/**
	 * Returns whether a normalized domain is a public suffix.
	 *
	 * @param domain ASCII domain.
	 * @returns Whether it is a public suffix.
	 */
	public static isPublicSuffix(domain: string): boolean {
		if (PublicSuffixList.exception.has(domain)) {
			return false;
		}
		if (PublicSuffixList.exact.has(domain)) {
			return true;
		}
		const separator = domain.indexOf('.');
		// The prevailing "*" rule makes unknown top-level domains public suffixes.
		return separator === -1 || PublicSuffixList.wildcard.has(domain.slice(separator + 1));
	}

	/**
	 * Returns whether a hostname equals a domain or is its DNS subdomain.
	 *
	 * @param hostname Hostname.
	 * @param domain Domain.
	 * @returns Whether the domain matches.
	 */
	public static domainMatches(hostname: string | undefined, domain: string): boolean {
		return (
			!!hostname &&
			(hostname === domain ||
				(!isIP(hostname.replace(/^\[|\]$/g, '')) && hostname.endsWith(`.${domain}`)))
		);
	}
}
