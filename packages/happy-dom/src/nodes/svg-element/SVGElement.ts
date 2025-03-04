import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Element from '../element/Element.js';
import SVGSVGElement from '../svg-svg-element/SVGSVGElement.js';
import Event from '../../event/Event.js';
import HTMLElementUtility from '../html-element/HTMLElementUtility.js';
import DOMStringMap from '../../dom/DOMStringMap.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element {
	// Internal properties
	public [PropertySymbol.style]: CSSStyleDeclaration | null = null;

	// Private properties
	#dataset: DOMStringMap | null = null;

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get onabort(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onabort');
	}

	public set onabort(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onabort', value);
	}

	public get onanimationend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationend');
	}

	public set onanimationend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationend', value);
	}

	public get onanimationiteration(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationiteration');
	}

	public set onanimationiteration(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationiteration', value);
	}

	public get onanimationstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onanimationstart');
	}

	public set onanimationstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onanimationstart', value);
	}

	public get onauxclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onauxclick');
	}

	public set onauxclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onauxclick', value);
	}

	public get onblur(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onblur');
	}

	public set onblur(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onblur', value);
	}

	public get oncancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncancel');
	}

	public set oncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncancel', value);
	}

	public get oncanplay(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncanplay');
	}

	public set oncanplay(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncanplay', value);
	}

	public get oncanplaythrough(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncanplaythrough');
	}

	public set oncanplaythrough(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncanplaythrough', value);
	}

	public get onchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onchange');
	}

	public set onchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onchange', value);
	}

	public get onclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onclick');
	}

	public set onclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclick', value);
	}

	public get onclose(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onclose');
	}

	public set onclose(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onclose', value);
	}

	public get oncontextmenu(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncontextmenu');
	}

	public set oncontextmenu(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextmenu', value);
	}

	public get oncopy(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncopy');
	}

	public set oncopy(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncopy', value);
	}

	public get oncuechange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncuechange');
	}

	public set oncuechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncuechange', value);
	}

	public get oncut(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncut');
	}

	public set oncut(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncut', value);
	}

	public get ondblclick(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondblclick');
	}

	public set ondblclick(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondblclick', value);
	}

	public get ondrag(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondrag');
	}

	public set ondrag(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondrag', value);
	}

	public get ondragend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondragend');
	}

	public set ondragend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragend', value);
	}

	public get ondragenter(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondragenter');
	}

	public set ondragenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragenter', value);
	}

	public get ondragleave(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondragleave');
	}

	public set ondragleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragleave', value);
	}

	public get ondragover(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondragover');
	}

	public set ondragover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragover', value);
	}

	public get ondragstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondragstart');
	}

	public set ondragstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondragstart', value);
	}

	public get ondrop(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondrop');
	}

	public set ondrop(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondrop', value);
	}

	public get ondurationchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ondurationchange');
	}

	public set ondurationchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ondurationchange', value);
	}

	public get onemptied(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onemptied');
	}

	public set onemptied(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onemptied', value);
	}

	public get onended(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onended');
	}

	public set onended(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onended', value);
	}

	public get onerror(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onerror');
	}

	public set onerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onerror', value);
	}

	public get onfocus(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onfocus');
	}

	public set onfocus(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfocus', value);
	}

	public get onformdata(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onformdata');
	}

	public set onformdata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onformdata', value);
	}

	public get ongotpointercapture(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ongotpointercapture');
	}

	public set ongotpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ongotpointercapture', value);
	}

	public get oninput(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oninput');
	}

	public set oninput(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninput', value);
	}

	public get oninvalid(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oninvalid');
	}

	public set oninvalid(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oninvalid', value);
	}

	public get onkeydown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onkeydown');
	}

	public set onkeydown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeydown', value);
	}

	public get onkeypress(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onkeypress');
	}

	public set onkeypress(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeypress', value);
	}

	public get onkeyup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onkeyup');
	}

	public set onkeyup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onkeyup', value);
	}

	public get onload(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onload');
	}

	public set onload(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onload', value);
	}

	public get onloadeddata(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onloadeddata');
	}

	public set onloadeddata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadeddata', value);
	}

	public get onloadedmetadata(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onloadedmetadata');
	}

	public set onloadedmetadata(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadedmetadata', value);
	}

	public get onloadstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onloadstart');
	}

	public set onloadstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onloadstart', value);
	}

	public get onlostpointercapture(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onlostpointercapture');
	}

	public set onlostpointercapture(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onlostpointercapture', value);
	}

	public get onmousedown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmousedown');
	}

	public set onmousedown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousedown', value);
	}

	public get onmouseenter(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseenter');
	}

	public set onmouseenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseenter', value);
	}

	public get onmouseleave(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseleave');
	}

	public set onmouseleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseleave', value);
	}

	public get onmousemove(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmousemove');
	}

	public set onmousemove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousemove', value);
	}

	public get onmouseout(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseout');
	}

	public set onmouseout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseout', value);
	}

	public get onmouseover(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseover');
	}

	public set onmouseover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseover', value);
	}

	public get onmouseup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmouseup');
	}

	public set onmouseup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmouseup', value);
	}

	public get onmousewheel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onmousewheel');
	}

	public set onmousewheel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onmousewheel', value);
	}

	public get onpaste(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpaste');
	}

	public set onpaste(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpaste', value);
	}

	public get onpause(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpause');
	}

	public set onpause(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpause', value);
	}

	public get onplay(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onplay');
	}

	public set onplay(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onplay', value);
	}

	public get onplaying(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onplaying');
	}

	public set onplaying(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onplaying', value);
	}

	public get onpointercancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointercancel');
	}

	public set onpointercancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointercancel', value);
	}

	public get onpointerdown(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerdown');
	}

	public set onpointerdown(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerdown', value);
	}

	public get onpointerenter(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerenter');
	}

	public set onpointerenter(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerenter', value);
	}

	public get onpointerleave(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerleave');
	}

	public set onpointerleave(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerleave', value);
	}

	public get onpointermove(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointermove');
	}

	public set onpointermove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointermove', value);
	}

	public get onpointerout(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerout');
	}

	public set onpointerout(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerout', value);
	}

	public get onpointerover(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerover');
	}

	public set onpointerover(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerover', value);
	}

	public get onpointerrawupdate(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerrawupdate');
	}

	public set onpointerrawupdate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerrawupdate', value);
	}

	public get onpointerup(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onpointerup');
	}

	public set onpointerup(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onpointerup', value);
	}

	public get onprogress(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onprogress');
	}

	public set onprogress(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onprogress', value);
	}

	public get onratechange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onratechange');
	}

	public set onratechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onratechange', value);
	}

	public get onreset(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onreset');
	}

	public set onreset(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onreset', value);
	}

	public get onresize(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onresize');
	}

	public set onresize(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onresize', value);
	}

	public get onscroll(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onscroll');
	}

	public set onscroll(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscroll', value);
	}

	public get onscrollend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onscrollend');
	}

	public set onscrollend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollend', value);
	}

	public get onscrollsnapchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onscrollsnapchange');
	}

	public set onscrollsnapchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollsnapchange', value);
	}

	public get onscrollsnapchanging(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onscrollsnapchanging');
	}

	public set onscrollsnapchanging(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onscrollsnapchanging', value);
	}

	public get onsecuritypolicyviolation(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onsecuritypolicyviolation');
	}

	public set onsecuritypolicyviolation(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsecuritypolicyviolation', value);
	}

	public get onseeked(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onseeked');
	}

	public set onseeked(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onseeked', value);
	}

	public get onseeking(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onseeking');
	}

	public set onseeking(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onseeking', value);
	}

	public get onselect(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onselect');
	}

	public set onselect(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselect', value);
	}

	public get onselectionchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onselectionchange');
	}

	public set onselectionchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselectionchange', value);
	}

	public get onselectstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onselectstart');
	}

	public set onselectstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onselectstart', value);
	}

	public get onslotchange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onslotchange');
	}

	public set onslotchange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onslotchange', value);
	}

	public get onstalled(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onstalled');
	}

	public set onstalled(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onstalled', value);
	}

	public get onsubmit(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onsubmit');
	}

	public set onsubmit(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsubmit', value);
	}

	public get onsuspend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onsuspend');
	}

	public set onsuspend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onsuspend', value);
	}

	public get ontimeupdate(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontimeupdate');
	}

	public set ontimeupdate(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontimeupdate', value);
	}

	public get ontoggle(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontoggle');
	}

	public set ontoggle(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontoggle', value);
	}

	public get ontransitioncancel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitioncancel');
	}

	public set ontransitioncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitioncancel', value);
	}

	public get ontransitionend(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionend');
	}

	public set ontransitionend(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionend', value);
	}

	public get ontransitionrun(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionrun');
	}

	public set ontransitionrun(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionrun', value);
	}

	public get ontransitionstart(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'ontransitionstart');
	}

	public set ontransitionstart(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('ontransitionstart', value);
	}

	public get onvolumechange(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onvolumechange');
	}

	public set onvolumechange(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onvolumechange', value);
	}

	public get onwaiting(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwaiting');
	}

	public set onwaiting(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwaiting', value);
	}

	public get onwheel(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwheel');
	}

	public set onwheel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwheel', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns current translate.
	 *
	 * @returns Element.
	 */
	public get ownerSVGElement(): SVGSVGElement | null {
		let parent = this[PropertySymbol.parentNode];
		while (parent) {
			if (parent[PropertySymbol.localName] === 'svg') {
				return <SVGSVGElement>parent;
			}

			parent = parent[PropertySymbol.parentNode];
		}
		return null;
	}

	/**
	 * Returns the SVGElement which established the current viewport. Often the nearest ancestor <svg> element. null if the given element is the outermost <svg> element.
	 *
	 * @returns SVG element.
	 */
	public get viewportElement(): SVGElement | null {
		return this.ownerSVGElement;
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): DOMStringMap {
		return (this.#dataset ??= new DOMStringMap(PropertySymbol.illegalConstructor, this));
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this[PropertySymbol.style]) {
			this[PropertySymbol.style] = new CSSStyleDeclaration(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{ element: this }
			);
		}
		return this[PropertySymbol.style];
	}

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		return tabIndex !== null ? Number(tabIndex) : -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		if (tabIndex === -1) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', String(tabIndex));
		}
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		HTMLElementUtility.blur(this);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		HTMLElementUtility.focus(this);
	}
}
