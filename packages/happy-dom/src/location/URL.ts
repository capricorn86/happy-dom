const URL_REGEXP = /(https?:)\/\/([-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6})(:[0-9]*)?([-a-zA-Z0-9@:%_\+.~c&//=]*)(\?[^#]*)?(#.*)?/;

export default class URL {
	public protocol = '';
	public hostname = '';
	public port = '';
	public pathname = '';
	public search = '';
	public hash = '';
	public username = '';
	public password = '';

	/**
	 * Constructor.
	 *
	 * @param url URL.
	 */
	constructor(url: string) {
		if (url) {
			this.parse(url);
		}
	}

	/**
	 * Returns the entire URL as a string.
	 */
	public toString(): string {
		return this.href;
	}

	/**
	 * Parses an URL.
	 *
	 * @param url URL.
	 */
	protected parse(url: string): void {
		const match = url.match(URL_REGEXP);
		if (!match) {
			throw new Error('Failed to parse URL "' + url + '". URL is in an invalid format.');
		}

		const hostnamePart = match[2] ? match[2].split('@') : '';
		const credentialsPart = hostnamePart.length > 1 ? hostnamePart[0].split(':') : null;

		this.protocol = match[1] || '';
		this.hostname = hostnamePart.length > 1 ? hostnamePart[1] : hostnamePart[0];
		this.port = match[3] || '';
		this.pathname = match[4] || '';
		this.search = match[5] || '';
		this.hash = match[6] || '';
		this.username = credentialsPart ? credentialsPart[0] : '';
		this.password = credentialsPart ? credentialsPart[1] : '';
	}

	/**
	 * Returns the entire URL as a string.
	 *
	 * @return Href.
	 */
	public get href(): string {
		const credentials = this.username ? `${this.username}:${this.password}@` : '';
		return this.protocol + '//' + credentials + this.host + this.pathname + this.search + this.hash;
	}

	/**
	 * Sets the href.
	 *
	 * @param url URL.
	 */
	public set href(url: string) {
		this.parse(url);
	}

	/**
	 * Returns the origin.
	 *
	 * @return HREF.
	 */
	public get origin(): string {
		return this.protocol + '//' + this.host;
	}

	/**
	 * Returns the entire URL as a string.
	 *
	 * @return Host.
	 */
	public get host(): string {
		return this.hostname + this.port;
	}
}
