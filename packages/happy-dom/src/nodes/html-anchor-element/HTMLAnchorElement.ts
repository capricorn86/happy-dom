import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DOMTokenList from '../../dom-token-list/DOMTokenList.js';
import IHTMLHyperlinkElementUtils from './IHTMLHyperlinkElementUtils.js';
import URL from '../../url/URL.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import HTMLAnchorElementNamedNodeMap from './HTMLAnchorElementNamedNodeMap.js';
import Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import MouseEvent from '../../event/events/MouseEvent.js';

/**
 * HTML Anchor Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement.
 */
export default class HTMLAnchorElement extends HTMLElement implements IHTMLHyperlinkElementUtils {
	public override [PropertySymbol.attributes]: NamedNodeMap = new HTMLAnchorElementNamedNodeMap(
		this
	);
	public [PropertySymbol.relList]: DOMTokenList = null;

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
		const href = this.getAttribute('href');
		if (href.startsWith('#')) {
			return href;
		}
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return '';
		}
		return url.hash;
	}

	/**
	 * Sets hash.
	 *
	 * @param hash Hash.
	 */
	public set hash(hash: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.hash = hash;
		this.href = url.href;
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string {
		if (!this.hasAttribute('href')) {
			return '';
		}

		try {
			return new URL(this.getAttribute('href'), this[PropertySymbol.ownerDocument].location.href)
				.href;
		} catch (e) {
			return this.getAttribute('href');
		}
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
		try {
			return new URL(this.href).origin;
		} catch (e) {
			return '';
		}
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
		try {
			return new URL(this.href).protocol;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets protocol.
	 *
	 * @param protocol Protocol.
	 */
	public set protocol(protocol: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.protocol = protocol;
		this.href = url.href;
	}

	/**
	 * Returns username.
	 *
	 * @returns Username.
	 */
	public get username(): string {
		try {
			return new URL(this.href).username;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets username.
	 *
	 * @param username Username.
	 */
	public set username(username: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.username = username;
		this.href = url.href;
	}

	/**
	 * Returns password.
	 *
	 * @returns Password.
	 */
	public get password(): string {
		try {
			return new URL(this.href).password;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets password.
	 *
	 * @param password Password.
	 */
	public set password(password: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.password = password;
		this.href = url.href;
	}

	/**
	 * Returns pathname.
	 *
	 * @returns Pathname.
	 */
	public get pathname(): string {
		try {
			return new URL(this.href).pathname;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets pathname.
	 *
	 * @param pathname Pathname.
	 */
	public set pathname(pathname: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.pathname = pathname;
		this.href = url.href;
	}

	/**
	 * Returns port.
	 *
	 * @returns Port.
	 */
	public get port(): string {
		try {
			return new URL(this.href).port;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets port.
	 *
	 * @param port Port.
	 */
	public set port(port: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.port = port;
		this.href = url.href;
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): string {
		try {
			return new URL(this.href).host;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets host.
	 *
	 * @param host Host.
	 */
	public set host(host: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.host = host;
		this.href = url.href;
	}

	/**
	 * Returns hostname.
	 *
	 * @returns Hostname.
	 */
	public get hostname(): string {
		try {
			return new URL(this.href).hostname;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets hostname.
	 *
	 * @param hostname Hostname.
	 */
	public set hostname(hostname: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.hostname = hostname;
		this.href = url.href;
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
	public get relList(): DOMTokenList {
		if (!this[PropertySymbol.relList]) {
			this[PropertySymbol.relList] = new DOMTokenList(this, 'rel');
		}
		return <DOMTokenList>this[PropertySymbol.relList];
	}

	/**
	 * Returns search.
	 *
	 * @returns Search.
	 */
	public get search(): string {
		try {
			return new URL(this.href).search;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Sets search.
	 *
	 * @param search Search.
	 */
	public set search(search: string) {
		let url: URL;
		try {
			url = new URL(this.href);
		} catch (e) {
			return;
		}
		url.search = search;
		this.href = url.href;
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
			event instanceof MouseEvent &&
			event.eventPhase === EventPhaseEnum.none &&
			!event.defaultPrevented
		) {
			const href = this.href;
			if (href) {
				this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].open(
					href,
					this.target || '_self'
				);
				if (this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].closed) {
					event.stopImmediatePropagation();
				}
			}
		}

		return returnValue;
	}
}
