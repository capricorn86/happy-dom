const CookiePairRegex = /([^=]+)(?:=([\s\S]*))?/;

/**
 * Cookie.
 */
export default class Cookie {
	private pairs: { [key: string]: string } = {};
	//
	public key = '';
	public value = '';
	public size = 0;
	// Optional
	public domain = '';
	public path = '';
	public expriesOrMaxAge: Date = null;
	public httpOnly = false;
	public secure = false;
	public sameSite = '';

	/**
	 * Constructor.
	 *
	 * @param cookie Cookie.
	 */
	constructor(cookie: string) {
		let match: RegExpExecArray | null;

		const parts = cookie.split(';').filter(Boolean);

		// Part[0] is the key-value pair.
		match = new RegExp(CookiePairRegex).exec(parts[0]);
		if (!match) {
			throw new Error(`Invalid cookie: ${cookie}`);
		}
		this.key = match[1].trim();
		this.value = match[2];
		// Set key is empty if match[2] is undefined.
		if (!match[2]) {
			this.value = this.key;
			this.key = '';
		}
		this.pairs[this.key] = this.value;
		this.size = this.key.length + this.value.length;
		// Attribute.
		for (const part of parts.slice(1)) {
			match = new RegExp(CookiePairRegex).exec(part);
			if (!match) {
				throw new Error(`Invalid cookie: ${part}`);
			}
			const key = match[1].trim();
			const value = match[2];

			switch (key.toLowerCase()) {
				case 'expires':
					this.expriesOrMaxAge = new Date(value);
					break;
				case 'max-age':
					this.expriesOrMaxAge = new Date(parseInt(value, 10) * 1000 + Date.now());
					break;
				case 'domain':
					this.domain = value;
					break;
				case 'path':
					this.path = value.startsWith('/') ? value : `/${value}`;
					break;
				case 'httponly':
					this.httpOnly = true;
					break;
				case 'secure':
					this.secure = true;
					break;
				case 'samesite':
					this.sameSite = value;
					break;
				default:
					continue; // Skip.
			}
			// Skip unknown key-value pair.
			if (
				['expires', 'max-age', 'domain', 'path', 'httponly', 'secure', 'samesite'].indexOf(
					key.toLowerCase()
				) === -1
			) {
				continue;
			}
			this.pairs[key] = value;
		}
	}

	/**
	 * Returns a raw string of the cookie.
	 */
	public rawString(): string {
		return Object.keys(this.pairs)
			.map((key) => {
				if (key) {
					return `${key}=${this.pairs[key]}`;
				}
				return this.pairs[key];
			})
			.join('; ');
	}

	/**
	 *
	 */
	public cookieString(): string {
		if (this.key) {
			return `${this.key}=${this.value}`;
		}
		return this.value;
	}

	/**
	 *
	 */
	public isExpired(): boolean {
		// If the expries/maxage is set, then determine whether it is expired.
		if (this.expriesOrMaxAge && this.expriesOrMaxAge.getTime() < Date.now()) {
			return true;
		}
		// If the expries/maxage is not set, it's a session-level cookie that will expire when the browser is closed.
		// (it's never expired in happy-dom)
		return false;
	}

	/**
	 *
	 */
	public isHttpOnly(): boolean {
		return this.httpOnly;
	}

	/**
	 *
	 */
	public isSecure(): boolean {
		return this.secure;
	}

	/**
	 * Parse a cookie string.
	 *
	 * @param cookieString
	 */
	public static parse(cookieString: string): Cookie {
		return new Cookie(cookieString);
	}

	/**
	 * Stringify a Cookie object.
	 *
	 * @param cookie
	 */
	public static stringify(cookie: Cookie): string {
		return cookie.toString();
	}
}
