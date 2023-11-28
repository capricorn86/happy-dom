import HTMLElement from '../html-element/HTMLElement.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import IDOMTokenList from '../../dom-token-list/IDOMTokenList.js';
import IHTMLAnchorElement from './IHTMLAnchorElement.js';
import URL from '../../url/URL.js';
import HTMLAnchorElementUtility from './HTMLAnchorElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLAnchorElementNamedNodeMap from './HTMLAnchorElementNamedNodeMap.js';
import Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';

/**
 * HTML Anchor Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement.
 */
export default class HTMLAnchorElement extends HTMLElement implements IHTMLAnchorElement {
	public override readonly attributes: INamedNodeMap = new HTMLAnchorElementNamedNodeMap(this);
	public __relList__: DOMTokenList = null;
	public __url__: URL | null = null;

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
		return this.__url__?.hash ?? '';
	}

	/**
	 * Sets hash.
	 *
	 * @param hash Hash.
	 */
	public set hash(hash: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.hash = hash;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string | null {
		if (this.__url__) {
			return this.__url__.toString();
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
		return this.__url__?.origin ?? '';
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
		return this.__url__?.protocol ?? '';
	}

	/**
	 * Sets protocol.
	 *
	 * @param protocol Protocol.
	 */
	public set protocol(protocol: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.protocol = protocol;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns username.
	 *
	 * @returns Username.
	 */
	public get username(): string {
		return this.__url__?.username ?? '';
	}

	/**
	 * Sets username.
	 *
	 * @param username Username.
	 */
	public set username(username: string) {
		if (
			this.__url__ &&
			!HTMLAnchorElementUtility.isBlobURL(this.__url__) &&
			this.__url__.host &&
			this.__url__.protocol != 'file'
		) {
			this.__url__.username = username;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns password.
	 *
	 * @returns Password.
	 */
	public get password(): string {
		return this.__url__?.password ?? '';
	}

	/**
	 * Sets password.
	 *
	 * @param password Password.
	 */
	public set password(password: string) {
		if (
			this.__url__ &&
			!HTMLAnchorElementUtility.isBlobURL(this.__url__) &&
			this.__url__.host &&
			this.__url__.protocol != 'file'
		) {
			this.__url__.password = password;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns pathname.
	 *
	 * @returns Pathname.
	 */
	public get pathname(): string {
		return this.__url__?.pathname ?? '';
	}

	/**
	 * Sets pathname.
	 *
	 * @param pathname Pathname.
	 */
	public set pathname(pathname: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.pathname = pathname;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns port.
	 *
	 * @returns Port.
	 */
	public get port(): string {
		return this.__url__?.port ?? '';
	}

	/**
	 * Sets port.
	 *
	 * @param port Port.
	 */
	public set port(port: string) {
		if (
			this.__url__ &&
			!HTMLAnchorElementUtility.isBlobURL(this.__url__) &&
			this.__url__.host &&
			this.__url__.protocol != 'file'
		) {
			this.__url__.port = port;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): string {
		return this.__url__?.host ?? '';
	}

	/**
	 * Sets host.
	 *
	 * @param host Host.
	 */
	public set host(host: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.host = host;
			this.setAttribute('href', this.__url__.toString());
		}
	}

	/**
	 * Returns hostname.
	 *
	 * @returns Hostname.
	 */
	public get hostname(): string {
		return this.__url__?.hostname ?? '';
	}

	/**
	 * Sets hostname.
	 *
	 * @param hostname Hostname.
	 */
	public set hostname(hostname: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.hostname = hostname;
			this.setAttribute('href', this.__url__.toString());
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
		if (!this.__relList__) {
			this.__relList__ = new DOMTokenList(this, 'rel');
		}
		return <IDOMTokenList>this.__relList__;
	}

	/**
	 * Returns search.
	 *
	 * @returns Search.
	 */
	public get search(): string {
		return this.__url__?.search ?? '';
	}

	/**
	 * Sets search.
	 *
	 * @param search Search.
	 */
	public set search(search: string) {
		if (this.__url__ && !HTMLAnchorElementUtility.isBlobURL(this.__url__)) {
			this.__url__.search = search;
			this.setAttribute('href', this.__url__.toString());
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

	/**
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (
			event.type === 'click' &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			!event.defaultPrevented &&
			this.__url__
		) {
			this.ownerDocument.__defaultView__.open(this.__url__.toString(), this.target || '_self');
			if (this.ownerDocument.__defaultView__.closed) {
				event.stopImmediatePropagation();
			}
		}

		return returnValue;
	}
}
