import HTMLElement from '../html-element/HTMLElement.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList.js';
import IHTMLAnchorElement from './IHTMLAnchorElement.js';
import URL from '../../url/URL.js';
import HTMLAnchorElementUtility from './HTMLAnchorElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLAnchorElementNamedNodeMap from './HTMLAnchorElementNamedNodeMap.js';

/**
 * HTML Anchor Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement.
 */
export default class HTMLAnchorElement extends HTMLElement implements IHTMLAnchorElement {
	public override readonly attributes: INamedNodeMap = new HTMLAnchorElementNamedNodeMap(this);
	public _relList: DOMTokenList = null;
	public _url: URL | null = null;

	/**
	 * Returns download.
	 *
	 * @returns download.
	 */
	public get download(): string {
		return this.getAttribute('download') || '';
	}

	/**
	 * Sets download.
	 *
	 * @param download Download.
	 */
	public set download(download: string) {
		this.setAttribute('download', download);
	}

	/**
	 * Returns hash.
	 *
	 * @returns Hash.
	 */
	public get hash(): string {
		return this._url?.hash ?? '';
	}

	/**
	 * Sets hash.
	 *
	 * @param hash Hash.
	 */
	public set hash(hash: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.hash = hash;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string | null {
		if (this._url) {
			return this._url.toString();
		}

		return this.getAttribute('href') || '';
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		this.setAttribute('href', href);
	}

	/**
	 * Returns hreflang.
	 *
	 * @returns Hreflang.
	 */
	public get hreflang(): string {
		return this.getAttribute('hreflang') || '';
	}

	/**
	 * Sets hreflang.
	 *
	 * @param hreflang Hreflang.
	 */
	public set hreflang(hreflang: string) {
		this.setAttribute('hreflang', hreflang);
	}

	/**
	 * Returns the hyperlink's URL's origin.
	 *
	 * @returns Origin.
	 */
	public get origin(): string {
		return this._url?.origin ?? '';
	}

	/**
	 * Returns ping.
	 *
	 * @returns Ping.
	 */
	public get ping(): string {
		return this.getAttribute('ping') || '';
	}

	/**
	 * Sets ping.
	 *
	 * @param ping Ping.
	 */
	public set ping(ping: string) {
		this.setAttribute('ping', ping);
	}

	/**
	 * Returns protocol.
	 *
	 * @returns Protocol.
	 */
	public get protocol(): string {
		return this._url?.protocol ?? '';
	}

	/**
	 * Sets protocol.
	 *
	 * @param protocol Protocol.
	 */
	public set protocol(protocol: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.protocol = protocol;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns username.
	 *
	 * @returns Username.
	 */
	public get username(): string {
		return this._url?.username ?? '';
	}

	/**
	 * Sets username.
	 *
	 * @param username Username.
	 */
	public set username(username: string) {
		if (
			this._url &&
			!HTMLAnchorElementUtility.isBlobURL(this._url) &&
			this._url.host &&
			this._url.protocol != 'file'
		) {
			this._url.username = username;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns password.
	 *
	 * @returns Password.
	 */
	public get password(): string {
		return this._url?.password ?? '';
	}

	/**
	 * Sets password.
	 *
	 * @param password Password.
	 */
	public set password(password: string) {
		if (
			this._url &&
			!HTMLAnchorElementUtility.isBlobURL(this._url) &&
			this._url.host &&
			this._url.protocol != 'file'
		) {
			this._url.password = password;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns pathname.
	 *
	 * @returns Pathname.
	 */
	public get pathname(): string {
		return this._url?.pathname ?? '';
	}

	/**
	 * Sets pathname.
	 *
	 * @param pathname Pathname.
	 */
	public set pathname(pathname: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.pathname = pathname;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns port.
	 *
	 * @returns Port.
	 */
	public get port(): string {
		return this._url?.port ?? '';
	}

	/**
	 * Sets port.
	 *
	 * @param port Port.
	 */
	public set port(port: string) {
		if (
			this._url &&
			!HTMLAnchorElementUtility.isBlobURL(this._url) &&
			this._url.host &&
			this._url.protocol != 'file'
		) {
			this._url.port = port;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): string {
		return this._url?.host ?? '';
	}

	/**
	 * Sets host.
	 *
	 * @param host Host.
	 */
	public set host(host: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.host = host;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns hostname.
	 *
	 * @returns Hostname.
	 */
	public get hostname(): string {
		return this._url?.hostname ?? '';
	}

	/**
	 * Sets hostname.
	 *
	 * @param hostname Hostname.
	 */
	public set hostname(hostname: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.hostname = hostname;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns referrerPolicy.
	 *
	 * @returns Referrer Policy.
	 */
	public get referrerPolicy(): string {
		return this.getAttribute('referrerPolicy') || '';
	}

	/**
	 * Sets referrerPolicy.
	 *
	 * @param referrerPolicy Referrer Policy.
	 */
	public set referrerPolicy(referrerPolicy: string) {
		this.setAttribute('referrerPolicy', referrerPolicy);
	}

	/**
	 * Returns rel.
	 *
	 * @returns Rel.
	 */
	public get rel(): string {
		return this.getAttribute('rel') || '';
	}

	/**
	 * Sets rel.
	 *
	 * @param rel Rel.
	 */
	public set rel(rel: string) {
		this.setAttribute('rel', rel);
	}

	/**
	 * Returns rel list.
	 *
	 * @returns Rel list.
	 */
	public get relList(): IDOMTokenList {
		if (!this._relList) {
			this._relList = new DOMTokenList(this, 'rel');
		}
		return <IDOMTokenList>this._relList;
	}

	/**
	 * Returns search.
	 *
	 * @returns Search.
	 */
	public get search(): string {
		return this._url?.search ?? '';
	}

	/**
	 * Sets search.
	 *
	 * @param search Search.
	 */
	public set search(search: string) {
		if (this._url && !HTMLAnchorElementUtility.isBlobURL(this._url)) {
			this._url.search = search;
			this.setAttribute('href', this._url.toString());
		}
	}

	/**
	 * Returns target.
	 *
	 * @returns target.
	 */
	public get target(): string {
		return this.getAttribute('target') || '';
	}

	/**
	 * Sets target.
	 *
	 * @param target Target.
	 */
	public set target(target: string) {
		this.setAttribute('target', target);
	}

	/**
	 * Returns text.
	 *
	 * @returns text.
	 */
	public get text(): string {
		return this.textContent;
	}

	/**
	 * Sets text.
	 *
	 * @param text Text.
	 */
	public set text(text: string) {
		this.textContent = text;
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public get type(): string {
		return this.getAttribute('type') || '';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this.setAttribute('type', type);
	}

	/**
	 * @override
	 */
	public override toString(): string {
		return this.href;
	}
}
