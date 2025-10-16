import Element from '../element/Element.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import Node from '../node/Node.js';
import NodeIterator from '../../tree-walker/NodeIterator.js';
import TreeWalker from '../../tree-walker/TreeWalker.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Event from '../../event/Event.js';
import DOMImplementation from '../../dom-implementation/DOMImplementation.js';
import INodeFilter from '../../tree-walker/INodeFilter.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import DocumentType from '../document-type/DocumentType.js';
import ParentNodeUtility from '../parent-node/ParentNodeUtility.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import CSSStyleSheet from '../../css/CSSStyleSheet.js';
import HTMLScriptElement from '../html-script-element/HTMLScriptElement.js';
import HTMLElement from '../html-element/HTMLElement.js';
import Comment from '../comment/Comment.js';
import Text from '../text/Text.js';
import NodeList from '../node/NodeList.js';
import HTMLCollection from '../element/HTMLCollection.js';
import HTMLLinkElement from '../html-link-element/HTMLLinkElement.js';
import HTMLStyleElement from '../html-style-element/HTMLStyleElement.js';
import DocumentReadyStateEnum from './DocumentReadyStateEnum.js';
import Location from '../../location/Location.js';
import Selection from '../../selection/Selection.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import Range from '../../range/Range.js';
import Attr from '../attr/Attr.js';
import ProcessingInstruction from '../processing-instruction/ProcessingInstruction.js';
import VisibilityStateEnum from './VisibilityStateEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import CookieStringUtility from '../../cookie/urilities/CookieStringUtility.js';
import { URL } from 'url';
import IHTMLElementTagNameMap from '../../config/IHTMLElementTagNameMap.js';
import ISVGElementTagNameMap from '../../config/ISVGElementTagNameMap.js';
import SVGElement from '../svg-element/SVGElement.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import HTMLAnchorElement from '../html-anchor-element/HTMLAnchorElement.js';
import HTMLElementConfig from '../../config/HTMLElementConfig.js';
import HTMLHtmlElement from '../html-html-element/HTMLHtmlElement.js';
import HTMLBodyElement from '../html-body-element/HTMLBodyElement.js';
import HTMLHeadElement from '../html-head-element/HTMLHeadElement.js';
import HTMLBaseElement from '../html-base-element/HTMLBaseElement.js';
import ICachedResult from '../node/ICachedResult.js';
import HTMLTitleElement from '../html-title-element/HTMLTitleElement.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';
import NodeFactory from '../NodeFactory.js';
import SVGElementConfig from '../../config/SVGElementConfig.js';
import StringUtility from '../../utilities/StringUtility.js';
import HTMLParser from '../../html-parser/HTMLParser.js';
import PreloadEntry from '../../fetch/preload/PreloadEntry.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import SVGScriptElement from '../svg-script-element/SVGScriptElement.js';

const PROCESSING_INSTRUCTION_TARGET_REGEXP = /^[a-z][a-z0-9-]+$/;

/**
 * Document.
 */
export default class Document extends Node {
	// Internal properties
	public [PropertySymbol.children]: HTMLCollection<Element> | null = null;
	public [PropertySymbol.activeElement]: HTMLElement | SVGElement | null = null;
	public [PropertySymbol.nextActiveElement]: HTMLElement | SVGElement | null = null;
	public [PropertySymbol.currentScript]: HTMLScriptElement | null = null;
	public [PropertySymbol.rootNode] = this;
	public [PropertySymbol.isFirstWrite] = true;
	public [PropertySymbol.isFirstWriteAfterOpen] = false;
	public [PropertySymbol.nodeType] = NodeTypeEnum.documentNode;
	public [PropertySymbol.isConnected] = true;
	public [PropertySymbol.adoptedStyleSheets]: CSSStyleSheet[] = [];
	public [PropertySymbol.implementation] = new DOMImplementation(this);
	public [PropertySymbol.readyState] = DocumentReadyStateEnum.interactive;
	public [PropertySymbol.referrer] = '';
	public [PropertySymbol.defaultView]: BrowserWindow | null = null;
	public [PropertySymbol.forms]: HTMLCollection<HTMLFormElement> | null = null;
	public [PropertySymbol.affectsComputedStyleCache]: ICachedResult[] = [];
	public [PropertySymbol.ownerDocument]: Document = <Document>(<unknown>null);
	public [PropertySymbol.elementIdMap]: Map<
		string,
		{ htmlCollection: HTMLCollection<Element> | null; elements: Element[] }
	> = new Map();
	public [PropertySymbol.contentType]: string = 'text/html';
	public [PropertySymbol.xmlProcessingInstruction]: ProcessingInstruction | null = null;
	public [PropertySymbol.preloads]: Map<string, PreloadEntry> = new Map();
	public [PropertySymbol.propertyEventListeners]: Map<string, ((event: Event) => void) | null> =
		new Map();
	public [PropertySymbol.selection]: Selection | null = null;
	public declare cloneNode: (deep?: boolean) => Document;

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get onreadystatechange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onreadystatechange') ?? null;
	}

	public set onreadystatechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onreadystatechange', value);
	}

	public get onpointerlockchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerlockchange') ?? null;
	}

	public set onpointerlockchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerlockchange', value);
	}

	public get onpointerlockerror(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerlockerror') ?? null;
	}

	public set onpointerlockerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerlockerror', value);
	}

	public get onbeforecopy(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforecopy') ?? null;
	}

	public set onbeforecopy(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforecopy', value);
	}

	public get onbeforecut(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforecut') ?? null;
	}

	public set onbeforecut(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforecut', value);
	}

	public get onbeforepaste(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforepaste') ?? null;
	}

	public set onbeforepaste(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforepaste', value);
	}

	public get onfreeze(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onfreeze') ?? null;
	}

	public set onfreeze(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfreeze', value);
	}

	public get onprerenderingchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onprerenderingchange') ?? null;
	}

	public set onprerenderingchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onprerenderingchange', value);
	}

	public get onresume(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onresume') ?? null;
	}

	public set onresume(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onresume', value);
	}

	public get onsearch(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onsearch') ?? null;
	}

	public set onsearch(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsearch', value);
	}

	public get onvisibilitychange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onvisibilitychange') ?? null;
	}

	public set onvisibilitychange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onvisibilitychange', value);
	}

	public get onfullscreenchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onfullscreenchange') ?? null;
	}

	public set onfullscreenchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfullscreenchange', value);
	}

	public get onfullscreenerror(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onfullscreenerror') ?? null;
	}

	public set onfullscreenerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfullscreenerror', value);
	}

	public get onwebkitfullscreenchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkitfullscreenchange') ?? null;
	}

	public set onwebkitfullscreenchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkitfullscreenchange', value);
	}

	public get onwebkitfullscreenerror(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkitfullscreenerror') ?? null;
	}

	public set onwebkitfullscreenerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkitfullscreenerror', value);
	}

	public get onbeforexrselect(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforexrselect') ?? null;
	}

	public set onbeforexrselect(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforexrselect', value);
	}

	public get onabort(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onabort') ?? null;
	}

	public set onabort(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onabort', value);
	}

	public get onbeforeinput(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforeinput') ?? null;
	}

	public set onbeforeinput(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforeinput', value);
	}

	public get onbeforematch(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforematch') ?? null;
	}

	public set onbeforematch(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforematch', value);
	}

	public get onbeforetoggle(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onbeforetoggle') ?? null;
	}

	public set onbeforetoggle(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onbeforetoggle', value);
	}

	public get onblur(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onblur') ?? null;
	}

	public set onblur(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onblur', value);
	}

	public get oncancel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncancel') ?? null;
	}

	public set oncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncancel', value);
	}

	public get oncanplay(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncanplay') ?? null;
	}

	public set oncanplay(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncanplay', value);
	}

	public get oncanplaythrough(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncanplaythrough') ?? null;
	}

	public set oncanplaythrough(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncanplaythrough', value);
	}

	public get onchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onchange') ?? null;
	}

	public set onchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onchange', value);
	}

	public get onclick(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onclick') ?? null;
	}

	public set onclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclick', value);
	}

	public get onclose(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onclose') ?? null;
	}

	public set onclose(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclose', value);
	}

	public get oncontentvisibilityautostatechange(): ((event: Event) => void) | null {
		return (
			this[PropertySymbol.propertyEventListeners].get('oncontentvisibilityautostatechange') ?? null
		);
	}

	public set oncontentvisibilityautostatechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontentvisibilityautostatechange', value);
	}

	public get oncontextlost(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncontextlost') ?? null;
	}

	public set oncontextlost(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextlost', value);
	}

	public get oncontextmenu(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncontextmenu') ?? null;
	}

	public set oncontextmenu(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextmenu', value);
	}

	public get oncontextrestored(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncontextrestored') ?? null;
	}

	public set oncontextrestored(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextrestored', value);
	}

	public get oncuechange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncuechange') ?? null;
	}

	public set oncuechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncuechange', value);
	}

	public get ondblclick(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondblclick') ?? null;
	}

	public set ondblclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondblclick', value);
	}

	public get ondrag(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondrag') ?? null;
	}

	public set ondrag(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondrag', value);
	}

	public get ondragend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondragend') ?? null;
	}

	public set ondragend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragend', value);
	}

	public get ondragenter(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondragenter') ?? null;
	}

	public set ondragenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragenter', value);
	}

	public get ondragleave(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondragleave') ?? null;
	}

	public set ondragleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragleave', value);
	}

	public get ondragover(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondragover') ?? null;
	}

	public set ondragover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragover', value);
	}

	public get ondragstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondragstart') ?? null;
	}

	public set ondragstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragstart', value);
	}

	public get ondrop(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondrop') ?? null;
	}

	public set ondrop(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondrop', value);
	}

	public get ondurationchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ondurationchange') ?? null;
	}

	public set ondurationchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondurationchange', value);
	}

	public get onemptied(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onemptied') ?? null;
	}

	public set onemptied(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onemptied', value);
	}

	public get onended(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onended') ?? null;
	}

	public set onended(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onended', value);
	}

	public get onerror(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onerror') ?? null;
	}

	public set onerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onerror', value);
	}

	public get onfocus(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onfocus') ?? null;
	}

	public set onfocus(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfocus', value);
	}

	public get onformdata(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onformdata') ?? null;
	}

	public set onformdata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onformdata', value);
	}

	public get oninput(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oninput') ?? null;
	}

	public set oninput(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninput', value);
	}

	public get oninvalid(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oninvalid') ?? null;
	}

	public set oninvalid(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninvalid', value);
	}

	public get onkeydown(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onkeydown') ?? null;
	}

	public set onkeydown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeydown', value);
	}

	public get onkeypress(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onkeypress') ?? null;
	}

	public set onkeypress(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeypress', value);
	}

	public get onkeyup(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onkeyup') ?? null;
	}

	public set onkeyup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeyup', value);
	}

	public get onload(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onload') ?? null;
	}

	public set onload(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onload', value);
	}

	public get onloadeddata(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onloadeddata') ?? null;
	}

	public set onloadeddata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadeddata', value);
	}

	public get onloadedmetadata(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onloadedmetadata') ?? null;
	}

	public set onloadedmetadata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadedmetadata', value);
	}

	public get onloadstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onloadstart') ?? null;
	}

	public set onloadstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadstart', value);
	}

	public get onmousedown(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmousedown') ?? null;
	}

	public set onmousedown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousedown', value);
	}

	public get onmouseenter(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmouseenter') ?? null;
	}

	public set onmouseenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseenter', value);
	}

	public get onmouseleave(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmouseleave') ?? null;
	}

	public set onmouseleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseleave', value);
	}

	public get onmousemove(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmousemove') ?? null;
	}

	public set onmousemove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousemove', value);
	}

	public get onmouseout(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmouseout') ?? null;
	}

	public set onmouseout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseout', value);
	}

	public get onmouseover(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmouseover') ?? null;
	}

	public set onmouseover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseover', value);
	}

	public get onmouseup(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmouseup') ?? null;
	}

	public set onmouseup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseup', value);
	}

	public get onmousewheel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onmousewheel') ?? null;
	}

	public set onmousewheel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousewheel', value);
	}

	public get onpause(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpause') ?? null;
	}

	public set onpause(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpause', value);
	}

	public get onplay(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onplay') ?? null;
	}

	public set onplay(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onplay', value);
	}

	public get onplaying(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onplaying') ?? null;
	}

	public set onplaying(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onplaying', value);
	}

	public get onprogress(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onprogress') ?? null;
	}

	public set onprogress(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onprogress', value);
	}

	public get onratechange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onratechange') ?? null;
	}

	public set onratechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onratechange', value);
	}

	public get onreset(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onreset') ?? null;
	}

	public set onreset(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onreset', value);
	}

	public get onresize(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onresize') ?? null;
	}

	public set onresize(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onresize', value);
	}

	public get onscroll(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onscroll') ?? null;
	}

	public set onscroll(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscroll', value);
	}

	public get onsecuritypolicyviolation(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onsecuritypolicyviolation') ?? null;
	}

	public set onsecuritypolicyviolation(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsecuritypolicyviolation', value);
	}

	public get onseeked(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onseeked') ?? null;
	}

	public set onseeked(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onseeked', value);
	}

	public get onseeking(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onseeking') ?? null;
	}

	public set onseeking(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onseeking', value);
	}

	public get onselect(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onselect') ?? null;
	}

	public set onselect(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselect', value);
	}

	public get onslotchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onslotchange') ?? null;
	}

	public set onslotchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onslotchange', value);
	}

	public get onstalled(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onstalled') ?? null;
	}

	public set onstalled(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onstalled', value);
	}

	public get onsubmit(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onsubmit') ?? null;
	}

	public set onsubmit(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsubmit', value);
	}

	public get onsuspend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onsuspend') ?? null;
	}

	public set onsuspend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsuspend', value);
	}

	public get ontimeupdate(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontimeupdate') ?? null;
	}

	public set ontimeupdate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontimeupdate', value);
	}

	public get ontoggle(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontoggle') ?? null;
	}

	public set ontoggle(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontoggle', value);
	}

	public get onvolumechange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onvolumechange') ?? null;
	}

	public set onvolumechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onvolumechange', value);
	}

	public get onwaiting(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwaiting') ?? null;
	}

	public set onwaiting(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwaiting', value);
	}

	public get onwebkitanimationend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkitanimationend') ?? null;
	}

	public set onwebkitanimationend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkitanimationend', value);
	}

	public get onwebkitanimationiteration(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkitanimationiteration') ?? null;
	}

	public set onwebkitanimationiteration(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkitanimationiteration', value);
	}

	public get onwebkitanimationstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkitanimationstart') ?? null;
	}

	public set onwebkitanimationstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkitanimationstart', value);
	}

	public get onwebkittransitionend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwebkittransitionend') ?? null;
	}

	public set onwebkittransitionend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebkittransitionend', value);
	}

	public get onwheel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onwheel') ?? null;
	}

	public set onwheel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwheel', value);
	}

	public get onauxclick(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onauxclick') ?? null;
	}

	public set onauxclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onauxclick', value);
	}

	public get ongotpointercapture(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ongotpointercapture') ?? null;
	}

	public set ongotpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ongotpointercapture', value);
	}

	public get onlostpointercapture(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onlostpointercapture') ?? null;
	}

	public set onlostpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onlostpointercapture', value);
	}

	public get onpointerdown(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerdown') ?? null;
	}

	public set onpointerdown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerdown', value);
	}

	public get onpointermove(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointermove') ?? null;
	}

	public set onpointermove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointermove', value);
	}

	public get onpointerrawupdate(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerrawupdate') ?? null;
	}

	public set onpointerrawupdate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerrawupdate', value);
	}

	public get onpointerup(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerup') ?? null;
	}

	public set onpointerup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerup', value);
	}

	public get onpointercancel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointercancel') ?? null;
	}

	public set onpointercancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointercancel', value);
	}

	public get onpointerover(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerover') ?? null;
	}

	public set onpointerover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerover', value);
	}

	public get onpointerout(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerout') ?? null;
	}

	public set onpointerout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerout', value);
	}

	public get onpointerenter(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerenter') ?? null;
	}

	public set onpointerenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerenter', value);
	}

	public get onpointerleave(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpointerleave') ?? null;
	}

	public set onpointerleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerleave', value);
	}

	public get onselectstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onselectstart') ?? null;
	}

	public set onselectstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselectstart', value);
	}

	public get onselectionchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onselectionchange') ?? null;
	}

	public set onselectionchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselectionchange', value);
	}

	public get onanimationend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onanimationend') ?? null;
	}

	public set onanimationend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationend', value);
	}

	public get onanimationiteration(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onanimationiteration') ?? null;
	}

	public set onanimationiteration(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationiteration', value);
	}

	public get onanimationstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onanimationstart') ?? null;
	}

	public set onanimationstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationstart', value);
	}

	public get ontransitionrun(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontransitionrun') ?? null;
	}

	public set ontransitionrun(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionrun', value);
	}

	public get ontransitionstart(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontransitionstart') ?? null;
	}

	public set ontransitionstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionstart', value);
	}

	public get ontransitionend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontransitionend') ?? null;
	}

	public set ontransitionend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionend', value);
	}

	public get ontransitioncancel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('ontransitioncancel') ?? null;
	}

	public set ontransitioncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitioncancel', value);
	}

	public get oncopy(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncopy') ?? null;
	}

	public set oncopy(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncopy', value);
	}

	public get oncut(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncut') ?? null;
	}

	public set oncut(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncut', value);
	}

	public get onpaste(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onpaste') ?? null;
	}

	public set onpaste(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpaste', value);
	}

	public get onscrollend(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onscrollend') ?? null;
	}

	public set onscrollend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollend', value);
	}

	public get onscrollsnapchange(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onscrollsnapchange') ?? null;
	}

	public set onscrollsnapchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollsnapchange', value);
	}

	public get onscrollsnapchanging(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onscrollsnapchanging') ?? null;
	}

	public set onscrollsnapchanging(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollsnapchanging', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns adopted style sheets.
	 *
	 * @returns Adopted style sheets.
	 */
	public get adoptedStyleSheets(): CSSStyleSheet[] {
		return this[PropertySymbol.adoptedStyleSheets];
	}

	/**
	 * Sets adopted style sheets.
	 *
	 * @param value Adopted style sheets.
	 */
	public set adoptedStyleSheets(value: CSSStyleSheet[]) {
		this[PropertySymbol.adoptedStyleSheets] = value;
	}

	/**
	 * Returns DOM implementation.
	 *
	 * @returns DOM implementation.
	 */
	public get implementation(): DOMImplementation {
		return this[PropertySymbol.implementation];
	}

	/**
	 * Returns document ready state.
	 *
	 * @returns Document ready state.
	 */
	public get readyState(): DocumentReadyStateEnum {
		return this[PropertySymbol.readyState];
	}

	/**
	 * Returns referrer.
	 *
	 * @returns Referrer.
	 */
	public get referrer(): string {
		return this[PropertySymbol.referrer];
	}

	/**
	 * Returns default view.
	 *
	 * @returns Default view.
	 */
	public get defaultView(): BrowserWindow | null {
		return this[PropertySymbol.defaultView];
	}

	/**
	 * Returns document children.
	 */
	public get children(): HTMLCollection<Element> {
		if (!this[PropertySymbol.children]) {
			const elements = this[PropertySymbol.elementArray];
			this[PropertySymbol.children] = new HTMLCollection<Element>(
				PropertySymbol.illegalConstructor,
				() => elements
			);
		}
		return this[PropertySymbol.children];
	}

	/**
	 * Returns character set.
	 *
	 * @deprecated
	 * @returns Character set.
	 */
	public get charset(): string {
		return this.characterSet;
	}

	/**
	 * Returns character set.
	 *
	 * @returns Character set.
	 */
	public get characterSet(): string {
		const charset = QuerySelector.querySelector(this, 'meta[charset]')?.getAttributeNS(
			null,
			'charset'
		);
		return charset ? charset : 'UTF-8';
	}

	/**
	 * Returns title.
	 *
	 * @returns Title.
	 */
	public get title(): string {
		const element = <HTMLTitleElement | null>ParentNodeUtility.getElementByTagName(this, 'title');
		if (element) {
			return element.text.trim();
		}
		return '';
	}

	/**
	 * Returns set title.
	 *
	 */
	public set title(title: string) {
		const element = ParentNodeUtility.getElementByTagName(this, 'title');
		if (element) {
			element.textContent = title;
		} else {
			const newElement = this.createElement('title');
			newElement.textContent = title;
			this.head.appendChild(newElement);
		}
	}

	/**
	 * Returns a collection of all area elements and a elements in a document with a value for the href attribute.
	 */
	public get links(): NodeList<HTMLAnchorElement | HTMLElement> {
		return <NodeList<HTMLElement>>QuerySelector.querySelectorAll(this, 'a[href],area[href]');
	}

	/**
	 * Returns a collection of all form elements in a document.
	 */
	public get forms(): HTMLCollection<HTMLFormElement> {
		if (!this[PropertySymbol.forms]) {
			this[PropertySymbol.forms] = <HTMLCollection<HTMLFormElement>>(
				ParentNodeUtility.getElementsByTagName(this, 'form')
			);
		}
		return this[PropertySymbol.forms];
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get childElementCount(): number {
		return this[PropertySymbol.elementArray].length;
	}

	/**
	 * First element child.
	 *
	 * @returns Element.
	 */
	public get firstElementChild(): Element {
		return this[PropertySymbol.elementArray][0] ?? null;
	}

	/**
	 * Last element child.
	 *
	 * @returns Element.
	 */
	public get lastElementChild(): Element {
		const children = this[PropertySymbol.elementArray];
		return children[children.length - 1] ?? null;
	}

	/**
	 * Returns cookie string.
	 *
	 * @returns Cookie.
	 */
	public get cookie(): string {
		const browserFrame = new WindowBrowserContext(this[PropertySymbol.window]).getBrowserFrame();
		if (!browserFrame) {
			return '';
		}
		return CookieStringUtility.cookiesToString(
			browserFrame.page.context.cookieContainer.getCookies(
				<URL>(<unknown>this[PropertySymbol.window].location),
				true
			)
		);
	}

	/**
	 * Sets a cookie string.
	 *
	 * @param cookie Cookie string.
	 */
	public set cookie(value: string) {
		const browserFrame = new WindowBrowserContext(this[PropertySymbol.window]).getBrowserFrame();
		if (!browserFrame) {
			return;
		}
		const cookie = CookieStringUtility.stringToCookie(this[PropertySymbol.window].location, value);
		if (cookie) {
			browserFrame.page.context.cookieContainer.addCookies([cookie]);
		}
	}

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '#document';
	}

	/**
	 * Returns <html> element.
	 *
	 * @returns Element.
	 */
	public get documentElement(): HTMLHtmlElement {
		return <HTMLHtmlElement>this[PropertySymbol.elementArray][0] ?? null;
	}

	/**
	 * Returns document type element.
	 *
	 * @returns Document type.
	 */
	public get doctype(): DocumentType {
		for (const node of this[PropertySymbol.nodeArray]) {
			if (node instanceof DocumentType) {
				return node;
			}
		}
		return null!;
	}

	/**
	 * Returns <body> element.
	 *
	 * @returns Element.
	 */
	public get body(): HTMLBodyElement {
		const documentElement = this.documentElement;
		return documentElement
			? <HTMLBodyElement>ParentNodeUtility.getElementByTagName(documentElement, 'body')
			: null!;
	}

	/**
	 * Returns <head> element.
	 *
	 * @returns Element.
	 */
	public get head(): HTMLHeadElement {
		const documentElement = this.documentElement;
		return documentElement
			? <HTMLHeadElement>ParentNodeUtility.getElementByTagName(documentElement, 'head')
			: null!;
	}

	/**
	 * Returns CSS style sheets.
	 *
	 * @returns CSS style sheets.
	 */
	public get styleSheets(): CSSStyleSheet[] {
		const styles = <NodeList<HTMLLinkElement | HTMLStyleElement>>(
			QuerySelector.querySelectorAll(this, 'link[rel="stylesheet"][href],style')
		);
		const styleSheets = [];
		for (const style of styles) {
			const sheet = style.sheet;
			if (sheet) {
				styleSheets.push(sheet);
			}
		}
		return styleSheets;
	}

	/**
	 * Returns active element.
	 *
	 * @returns Active element.
	 */
	public get activeElement(): HTMLElement | SVGElement {
		if (
			this[PropertySymbol.activeElement] &&
			!this[PropertySymbol.activeElement][PropertySymbol.isConnected]
		) {
			this[PropertySymbol.activeElement] = null;
		}

		if (
			this[PropertySymbol.activeElement] &&
			this[PropertySymbol.activeElement] instanceof Element
		) {
			let rootNode: ShadowRoot | Document = <ShadowRoot | Document>(
				this[PropertySymbol.activeElement].getRootNode()
			);
			let activeElement = this[PropertySymbol.activeElement];
			while (rootNode !== this) {
				activeElement = <HTMLElement | SVGElement>(<ShadowRoot>rootNode).host;
				rootNode = activeElement ? <ShadowRoot | Document>activeElement.getRootNode() : this;
			}
			return activeElement;
		}
		return this[PropertySymbol.activeElement] || this.body || this.documentElement || null;
	}

	/**
	 * Returns scrolling element.
	 *
	 * @returns Scrolling element.
	 */
	public get scrollingElement(): HTMLElement {
		return this.documentElement;
	}

	/**
	 * Returns location.
	 *
	 * @returns Location.
	 */
	public get location(): Location {
		return this[PropertySymbol.window].location;
	}

	/**
	 * Returns scripts.
	 *
	 * @returns Scripts.
	 */
	public get scripts(): HTMLCollection<HTMLScriptElement> {
		return this.getElementsByTagName('script');
	}

	/**
	 * Returns base URI.
	 *
	 * @override
	 * @returns Base URI.
	 */
	public get baseURI(): string {
		const element = <HTMLBaseElement>ParentNodeUtility.getElementByTagName(this, 'base');
		if (element) {
			return element.href;
		}
		return this[PropertySymbol.window].location.href;
	}

	/**
	 * Returns URL.
	 *
	 * @returns URL of the current document.
	 * */
	public get URL(): string {
		return this[PropertySymbol.window].location.href;
	}

	/**
	 * Returns document URI.
	 *
	 * @returns URL of the current document.
	 * */
	public get documentURI(): string {
		return this.URL;
	}

	/**
	 * Returns domain.
	 *
	 * @returns Domain.
	 * */
	public get domain(): string {
		return this[PropertySymbol.window].location.hostname;
	}

	/**
	 * Returns document visibility state.
	 *
	 * @returns the visibility state of the current document.
	 * */
	public get visibilityState(): VisibilityStateEnum {
		if (this.defaultView) {
			return VisibilityStateEnum.visible;
		}

		return VisibilityStateEnum.hidden;
	}

	/**
	 * Returns document hidden state.
	 *
	 * @returns the hidden state of the current document.
	 * */
	public get hidden(): boolean {
		if (this.defaultView) {
			return false;
		}

		return true;
	}

	/**
	 * Gets the currently executing script element.
	 *
	 * @returns the currently executing script element.
	 */
	public get currentScript(): HTMLScriptElement | SVGScriptElement | null {
		return this[PropertySymbol.currentScript];
	}

	/**
	 * Returns content type.
	 *
	 * @returns Content type.
	 */
	public get contentType(): string {
		return this[PropertySymbol.contentType];
	}

	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public append(...nodes: (Node | string)[]): void {
		ParentNodeUtility.append(this, ...nodes);
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public prepend(...nodes: (Node | string)[]): void {
		ParentNodeUtility.prepend(this, ...nodes);
	}

	/**
	 * Replaces the existing children of a node with a specified new set of children.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceChildren(...nodes: (Node | string)[]): void {
		ParentNodeUtility.replaceChildren(this, ...nodes);
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): NodeList<IHTMLElementTagNameMap[K]>;

	/**
	 * Query CSS selector to find matching elements.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): NodeList<ISVGElementTagNameMap[K]>;

	/**
	 * Query CSS selector to find matching elements.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): NodeList<Element>;

	/**
	 * Query CSS selector to find matching elements.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): NodeList<Element> {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector<K extends keyof IHTMLElementTagNameMap>(
		selector: K
	): IHTMLElementTagNameMap[K] | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector<K extends keyof ISVGElementTagNameMap>(
		selector: K
	): ISVGElementTagNameMap[K] | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): Element | null;

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @returns Matching element.
	 */
	public querySelector(selector: string): Element | null {
		return QuerySelector.querySelector(this, selector);
	}
	/**
	 * Returns true if the command is supported.
	 * @deprecated
	 * @param _ Command.
	 * @returns True if the command is supported, false otherwise.
	 */
	public queryCommandSupported(_: string): boolean {
		if (!arguments.length) {
			throw new this[PropertySymbol.window].TypeError(
				"Failed to execute 'queryCommandSupported' on 'Document': 1 argument required, but only 0 present."
			);
		}
		return true;
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public getElementsByClassName(className: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByClassName(this, className);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName<K extends keyof IHTMLElementTagNameMap>(
		tagName: K
	): HTMLCollection<IHTMLElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName<K extends keyof ISVGElementTagNameMap>(
		tagName: K
	): HTMLCollection<ISVGElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): HTMLCollection<Element>;

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagName(tagName: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByTagName(this, tagName);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS<K extends keyof IHTMLElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/1999/xhtml',
		tagName: K
	): HTMLCollection<IHTMLElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS<K extends keyof ISVGElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/2000/svg',
		tagName: K
	): HTMLCollection<ISVGElementTagNameMap[K]>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): HTMLCollection<Element>;

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public getElementsByTagNameNS(namespaceURI: string, tagName: string): HTMLCollection<Element> {
		return ParentNodeUtility.getElementsByTagNameNS(this, namespaceURI, tagName);
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param id ID.
	 * @returns Matching element.
	 */
	public getElementById(id: string): Element | null {
		return <Element>ParentNodeUtility.getElementById(this, id);
	}

	/**
	 * Returns an element by Name.
	 *
	 * @returns Matching element.
	 * @param name
	 */
	public getElementsByName(name: string): NodeList<Element> {
		return QuerySelector.querySelectorAll(this, `[name="${name}"]`);
	}

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param html HTML.
	 */
	public write(html: string): void {
		if (this[PropertySymbol.isFirstWrite] || this[PropertySymbol.isFirstWriteAfterOpen]) {
			if (this[PropertySymbol.isFirstWrite]) {
				if (!this[PropertySymbol.isFirstWriteAfterOpen]) {
					this.open();
				}

				this[PropertySymbol.isFirstWrite] = false;
			}

			const { documentElement, head, body } = this;

			if (!documentElement || !head || !body) {
				this.open();
			}

			this[PropertySymbol.isFirstWrite] = false;
			this[PropertySymbol.isFirstWriteAfterOpen] = false;

			new HTMLParser(this[PropertySymbol.window], {
				evaluateScripts: true
			}).parse(html, this);
		} else {
			new HTMLParser(this[PropertySymbol.window], {
				evaluateScripts: true
			}).parse(html, this.body);
		}
	}

	/**
	 * Opens the document.
	 *
	 * @returns Document.
	 */
	public open(): Document {
		this[PropertySymbol.isFirstWriteAfterOpen] = true;

		for (const eventType of this[PropertySymbol.listeners].bubbling.keys()) {
			const listeners = this[PropertySymbol.listeners].bubbling.get(eventType);
			if (listeners) {
				for (const listener of listeners) {
					this.removeEventListener(eventType, listener);
				}
			}
		}

		for (const eventType of this[PropertySymbol.listeners].capturing.keys()) {
			const listeners = this[PropertySymbol.listeners].capturing.get(eventType);
			if (listeners) {
				for (const listener of listeners) {
					this.removeEventListener(eventType, listener);
				}
			}
		}

		const childNodes = this[PropertySymbol.nodeArray];
		while (childNodes.length) {
			this.removeChild(childNodes[0]);
		}

		// Default document elements
		const doctype = this[PropertySymbol.implementation].createDocumentType('html', '', '');
		const documentElement = this.createElement('html');
		const bodyElement = this.createElement('body');
		const headElement = this.createElement('head');

		this.appendChild(doctype);
		this.appendChild(documentElement);

		documentElement.appendChild(headElement);
		documentElement.appendChild(bodyElement);

		return this;
	}

	/**
	 * Closes the document.
	 */
	public close(): void {}

	/* eslint-disable jsdoc/valid-types */

	/**
	 * Creates an element.
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElement<K extends keyof IHTMLElementTagNameMap>(
		qualifiedName: K,
		options?: { is?: string }
	): IHTMLElementTagNameMap[K];

	/**
	 * Creates an element.
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElement<K extends keyof ISVGElementTagNameMap>(
		qualifiedName: K,
		options?: { is?: string }
	): ISVGElementTagNameMap[K];

	/**
	 * Creates an element.
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElement(qualifiedName: string, options?: { is?: string }): HTMLElement;

	/**
	 * Creates an element.
	 *
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElement(qualifiedName: string, options?: { is?: string }): HTMLElement {
		return <HTMLElement>(
			this.createElementNS(
				NamespaceURI.html,
				StringUtility.asciiLowerCase(String(qualifiedName)),
				options
			)
		);
	}

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElementNS<K extends keyof IHTMLElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/1999/xhtml',
		qualifiedName: K,
		options?: { is?: string }
	): IHTMLElementTagNameMap[K];

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElementNS<K extends keyof ISVGElementTagNameMap>(
		namespaceURI: 'http://www.w3.org/2000/svg',
		qualifiedName: K,
		options?: { is?: string }
	): ISVGElementTagNameMap[K];

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElementNS(
		namespaceURI: string | null,
		qualifiedName: string,
		options?: { is?: string }
	): Element;

	/**
	 * Creates an element with the specified namespace URI and qualified name.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Tag name.
	 * @param [options] Options.
	 * @param [options.is] Tag name of a custom element previously defined via customElements.define().
	 * @returns Element.
	 */
	public createElementNS(
		namespaceURI: string | null,
		qualifiedName: string,
		options?: { is?: string }
	): Element {
		const window = this[PropertySymbol.window];

		qualifiedName = String(qualifiedName);

		if (!qualifiedName) {
			throw new window.DOMException(
				"Failed to execute 'createElementNS' on 'Document': The qualified name provided is empty."
			);
		}

		const parts = qualifiedName.split(':');
		const localName = parts[1] ?? parts[0];
		const prefix = parts[1] ? parts[0] : null;

		switch (namespaceURI) {
			case NamespaceURI.svg:
				const config = SVGElementConfig[qualifiedName.toLowerCase()];
				const svgElementClass: typeof SVGElement =
					config && config.localName === qualifiedName
						? (<any>window)[config.className]
						: window.SVGElement;

				const svgElement = NodeFactory.createNode<SVGElement>(this, svgElementClass);

				svgElement[PropertySymbol.tagName] = qualifiedName;
				svgElement[PropertySymbol.localName] = localName;
				svgElement[PropertySymbol.prefix] = prefix;
				svgElement[PropertySymbol.namespaceURI] = namespaceURI;
				svgElement[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

				return svgElement;
			case NamespaceURI.html:
				// Custom HTML element
				// If a polyfill is used, [PropertySymbol.registry] may be undefined
				const customElementDefinition = window.customElements[PropertySymbol.registry]?.get(
					options && options.is ? String(options.is) : qualifiedName
				);

				if (customElementDefinition) {
					const element = new customElementDefinition.elementClass();
					element[PropertySymbol.tagName] = StringUtility.asciiUpperCase(qualifiedName);
					element[PropertySymbol.localName] = localName;
					element[PropertySymbol.prefix] = prefix;
					element[PropertySymbol.namespaceURI] = namespaceURI;
					element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;
					return element;
				}

				const elementClass: typeof HTMLElement = HTMLElementConfig[qualifiedName]
					? (<any>window)[HTMLElementConfig[qualifiedName].className]
					: null;

				// Known HTML element
				if (elementClass) {
					const element = NodeFactory.createNode<Element>(this, elementClass);

					element[PropertySymbol.tagName] = StringUtility.asciiUpperCase(qualifiedName);
					element[PropertySymbol.localName] = localName;
					element[PropertySymbol.prefix] = prefix;
					element[PropertySymbol.namespaceURI] = namespaceURI;
					element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

					return element;
				}

				// Unknown HTML element (if it has an hyphen in the name, it is a custom element that hasn't been defined yet)
				const unknownElementClass = qualifiedName.includes('-')
					? window.HTMLElement
					: window.HTMLUnknownElement;

				const unknownElement = NodeFactory.createNode<Element>(this, unknownElementClass);

				unknownElement[PropertySymbol.tagName] = StringUtility.asciiUpperCase(qualifiedName);
				unknownElement[PropertySymbol.localName] = localName;
				unknownElement[PropertySymbol.prefix] = prefix;
				unknownElement[PropertySymbol.namespaceURI] = namespaceURI;
				unknownElement[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

				return unknownElement;
			default:
				const element = NodeFactory.createNode<Element>(this, Element);

				element[PropertySymbol.tagName] = qualifiedName;
				element[PropertySymbol.localName] = localName;
				element[PropertySymbol.prefix] = prefix;
				element[PropertySymbol.namespaceURI] = namespaceURI;
				element[PropertySymbol.isValue] = options && options.is ? String(options.is) : null;

				return element;
		}
	}

	/* eslint-enable jsdoc/valid-types */

	/**
	 * Creates a text node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createTextNode(data: string): Text {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'createTextNode' on 'Document': 1 argument required, but only ${arguments.length} present.`
			);
		}
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		return NodeFactory.createNode(this, this[PropertySymbol.window].Text, String(data));
	}

	/**
	 * Creates a comment node.
	 *
	 * @param [data] Text data.
	 * @returns Text node.
	 */
	public createComment(data?: string): Comment {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'createComment' on 'Document': 1 argument required, but only ${arguments.length} present.`
			);
		}
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		return NodeFactory.createNode(this, this[PropertySymbol.window].Comment, String(data));
	}

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	public createDocumentFragment(): DocumentFragment {
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		return NodeFactory.createNode(this, this[PropertySymbol.window].DocumentFragment);
	}

	/**
	 * Creates a node iterator.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	public createNodeIterator(
		root: Node,
		whatToShow = -1,
		filter: INodeFilter | null = null
	): NodeIterator {
		return new NodeIterator(root, whatToShow, filter);
	}

	/**
	 * Creates a Tree Walker.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	public createTreeWalker(
		root: Node,
		whatToShow = -1,
		filter: INodeFilter | null = null
	): TreeWalker {
		return new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Creates an event.
	 *
	 * @deprecated
	 * @param type Type.
	 * @returns Event.
	 */
	public createEvent(type: string): Event {
		if (typeof (<any>this[PropertySymbol.window])[type] === 'function') {
			return new (<any>this[PropertySymbol.window])[type]('init');
		}
		return new Event('init');
	}

	/**
	 * Creates an Attr node.
	 *
	 * @param qualifiedName Name.
	 * @returns Attribute.
	 */
	public createAttribute(qualifiedName: string): Attr {
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		const attribute = NodeFactory.createNode(this, this[PropertySymbol.window].Attr);

		const name = StringUtility.asciiLowerCase(qualifiedName);
		const parts = name.split(':');

		attribute[PropertySymbol.name] = name;
		attribute[PropertySymbol.localName] = parts[1] ?? name;
		attribute[PropertySymbol.prefix] = parts[1] ? parts[0] : null;

		return attribute;
	}

	/**
	 * Creates a namespaced Attr node.
	 *
	 * @param namespaceURI Namespace URI.
	 * @param qualifiedName Qualified name.
	 * @returns Element.
	 */
	public createAttributeNS(namespaceURI: string | null, qualifiedName: string): Attr {
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		const attribute = NodeFactory.createNode(this, this[PropertySymbol.window].Attr);

		const parts = qualifiedName.split(':');

		attribute[PropertySymbol.namespaceURI] = namespaceURI;
		attribute[PropertySymbol.name] = qualifiedName;
		attribute[PropertySymbol.localName] = parts[1] ?? qualifiedName;
		attribute[PropertySymbol.prefix] = parts[1] ? parts[0] : null;

		if (!namespaceURI && attribute[PropertySymbol.prefix]) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'createAttributeNS' on 'Document': The namespace URI provided ('${
					namespaceURI || ''
				}') is not valid for the qualified name provided ('${qualifiedName}').`,
				DOMExceptionNameEnum.namespaceError
			);
		}

		return attribute;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param [deep=false] Set to "true" if the clone should be deep.
	 */
	public importNode(node: Node, deep = false): Node {
		if (!(node instanceof Node)) {
			throw new this[PropertySymbol.window].DOMException('Parameter 1 was not of type Node.');
		}
		const clone = node.cloneNode(deep);
		this.#importNode(clone);
		return clone;
	}

	/**
	 * Creates a range.
	 *
	 * @returns Range.
	 */
	public createRange(): Range {
		return new this[PropertySymbol.window].Range();
	}

	/**
	 * Adopts a node.
	 *
	 * @param node Node to adopt.
	 * @returns Adopted node.
	 */
	public adoptNode(node: Node): Node {
		if (!(node instanceof Node)) {
			throw new this[PropertySymbol.window].DOMException('Parameter 1 was not of type Node.');
		}

		const adopted = node[PropertySymbol.parentNode]
			? node[PropertySymbol.parentNode].removeChild(node)
			: node;
		const document = this;
		Object.defineProperty(adopted, 'ownerDocument', { value: document });
		return adopted;
	}

	/**
	 * Returns selection.
	 *
	 * @returns Selection.
	 */
	public getSelection(): Selection {
		if (!this[PropertySymbol.selection]) {
			this[PropertySymbol.selection] = new Selection(this);
		}
		return this[PropertySymbol.selection];
	}

	/**
	 * Returns a boolean value indicating whether the document or any element inside the document has focus.
	 *
	 * @returns "true" if the document has focus.
	 */
	public hasFocus(): boolean {
		return !!this.activeElement;
	}

	/**
	 * Creates a Processing Instruction node.
	 *
	 * @param target Target.
	 * @param data Data.
	 * @returns ProcessingInstruction.
	 */
	public createProcessingInstruction(target: string, data: string): ProcessingInstruction {
		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'createProcessingInstruction' on 'Document': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		target = String(target);
		data = String(data);

		if (!target || !PROCESSING_INSTRUCTION_TARGET_REGEXP.test(target)) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'createProcessingInstruction' on 'Document': The target provided ('${target}') is not a valid name.`
			);
		}
		if (data.includes('?>')) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'createProcessingInstruction' on 'Document': The data provided ('?>') contains '?>'`
			);
		}
		// We should use the NodeFactory and not the class constructor, so that owner document will be this document
		const element = NodeFactory.createNode(this, this[PropertySymbol.window].ProcessingInstruction);

		element[PropertySymbol.data] = data;
		element[PropertySymbol.target] = target;

		return element;
	}

	/**
	 * Get element at a given point.
	 *
	 * @param _x horizontal coordinate
	 * @param _y vertical coordinate
	 * @returns Always returns null since Happy DOM does not render elements.
	 */
	public elementFromPoint(_x: number, _y: number): Element | null {
		return null;
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node.
	 */
	#importNode(node: Node): void {
		node[PropertySymbol.ownerDocument] = this;

		for (const child of node[PropertySymbol.nodeArray]) {
			this.#importNode(child);
		}
	}
}
