import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DOMTokenList from '../../dom/DOMTokenList.js';
import HTMLHyperlinkElementUtility from '../html-hyperlink-element/HTMLHyperlinkElementUtility.js';
import IHTMLHyperlinkElement from '../html-hyperlink-element/IHTMLHyperlinkElement.js';
import Event from '../../event/Event.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import MouseEvent from '../../event/events/MouseEvent.js';

// Used for caching the utility instance - module-scoped symbol to avoid prototype issues
const HYPERLINK_UTILITY = Symbol('hyperlinkUtility');

/**
 * Returns the hyperlink utility for an element, creating it if necessary.
 * Returns null if called on a non-instance (e.g., prototype).
 *
 * @param element The element to get the utility for.
 * @returns The hyperlink utility or null.
 */
function getHyperlinkUtility(element: HTMLAreaElement): HTMLHyperlinkElementUtility | null {
	if (!(element instanceof HTMLAreaElement)) {
		return null;
	}
	if (!element[HYPERLINK_UTILITY]) {
		element[HYPERLINK_UTILITY] = new HTMLHyperlinkElementUtility(element);
	}
	return element[HYPERLINK_UTILITY];
}

/**
 * HTMLAreaElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAreaElement
 */
export default class HTMLAreaElement extends HTMLElement implements IHTMLHyperlinkElement {
	public [PropertySymbol.relList]: DOMTokenList | null = null;
	public declare [HYPERLINK_UTILITY]: HTMLHyperlinkElementUtility;

	/**
	 * Returns alt.
	 *
	 * @returns Alt.
	 */
	public get alt(): string {
		return this.getAttribute('alt') || '';
	}

	/**
	 * Sets alt.
	 *
	 * @param alt Alt.
	 */
	public set alt(alt: string) {
		this.setAttribute('alt', alt);
	}

	/**
	 * Returns coords.
	 *
	 * @returns Coords.
	 */
	public get coords(): string {
		return this.getAttribute('coords') || '';
	}

	/**
	 * Sets coords.
	 *
	 * @param coords Coords.
	 */
	public set coords(coords: string) {
		this.setAttribute('coords', coords);
	}

	/**
	 * Returns shape.
	 *
	 * @returns Shape.
	 */
	public get shape(): string {
		return this.getAttribute('shape') || '';
	}

	/**
	 * Sets shape.
	 *
	 * @param shape Shape.
	 */
	public set shape(shape: string) {
		this.setAttribute('shape', shape);
	}

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
			this[PropertySymbol.relList] = new DOMTokenList(
				PropertySymbol.illegalConstructor,
				this,
				'rel'
			);
		}
		return <DOMTokenList>this[PropertySymbol.relList];
	}

	/**
	 * Sets rel list.
	 *
	 * @param value Value.
	 */
	public set relList(value: string) {
		this.setAttribute('rel', value);
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
	 * Returns the hyperlink's URL's origin.
	 *
	 * @returns Origin.
	 */
	public get origin(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getOrigin() : '';
	}

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getHref() : '';
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public set href(href: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setHref(href);
	}

	/**
	 * Returns protocol.
	 *
	 * @returns Protocol.
	 */
	public get protocol(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getProtocol() : '';
	}

	/**
	 * Sets protocol.
	 *
	 * @param protocol Protocol.
	 */
	public set protocol(protocol: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setProtocol(protocol);
	}

	/**
	 * Returns username.
	 *
	 * @returns Username.
	 */
	public get username(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getUsername() : '';
	}

	/**
	 * Sets username.
	 *
	 * @param username Username.
	 */
	public set username(username: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setUsername(username);
	}

	/**
	 * Returns password.
	 *
	 * @returns Password.
	 */
	public get password(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getPassword() : '';
	}

	/**
	 * Sets password.
	 *
	 * @param password Password.
	 */
	public set password(password: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setPassword(password);
	}

	/**
	 * Returns host.
	 *
	 * @returns Host.
	 */
	public get host(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getHost() : '';
	}

	/**
	 * Sets host.
	 *
	 * @param host Host.
	 */
	public set host(host: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setHost(host);
	}

	/**
	 * Returns hostname.
	 *
	 * @returns Hostname.
	 */
	public get hostname(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getHostname() : '';
	}

	/**
	 * Sets hostname.
	 *
	 * @param hostname Hostname.
	 */
	public set hostname(hostname: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setHostname(hostname);
	}

	/**
	 * Returns port.
	 *
	 * @returns Port.
	 */
	public get port(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getPort() : '';
	}

	/**
	 * Sets port.
	 *
	 * @param port Port.
	 */
	public set port(port: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setPort(port);
	}

	/**
	 * Returns pathname.
	 *
	 * @returns Pathname.
	 */
	public get pathname(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getPathname() : '';
	}

	/**
	 * Sets pathname.
	 *
	 * @param pathname Pathname.
	 */
	public set pathname(pathname: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setPathname(pathname);
	}

	/**
	 * Returns search.
	 *
	 * @returns Search.
	 */
	public get search(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getSearch() : '';
	}

	/**
	 * Sets search.
	 *
	 * @param search Search.
	 */
	public set search(search: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setSearch(search);
	}

	/**
	 * Returns hash.
	 *
	 * @returns Hash.
	 */
	public get hash(): string {
		const utility = getHyperlinkUtility(this);
		return utility ? utility.getHash() : '';
	}

	/**
	 * Sets hash.
	 *
	 * @param hash Hash.
	 */
	public set hash(hash: string) {
		const utility = getHyperlinkUtility(this);
		utility?.setHash(hash);
	}

	/**
	 * @override
	 */
	public override get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		if (tabIndex !== null) {
			const parsed = Number(tabIndex);
			return isNaN(parsed) ? 0 : parsed;
		}
		return 0;
	}

	/**
	 * @override
	 */
	public override set tabIndex(tabIndex: number) {
		super.tabIndex = tabIndex;
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
			!event[PropertySymbol.defaultPrevented] &&
			event[PropertySymbol.type] === 'click' &&
			event[PropertySymbol.eventPhase] === EventPhaseEnum.none &&
			event instanceof MouseEvent
		) {
			const href = this.href;
			if (href) {
				this[PropertySymbol.window].open(href, this.target || '_self');
				if (this[PropertySymbol.window].closed) {
					event.stopImmediatePropagation();
				}
			}
		}

		return returnValue;
	}
}
