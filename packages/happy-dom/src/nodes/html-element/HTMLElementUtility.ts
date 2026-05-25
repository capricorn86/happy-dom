import FocusEvent from '../../event/events/FocusEvent.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import NodeFilter from '../../tree-walker/NodeFilter.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import type HTMLElement from '../html-element/HTMLElement.js';
import type Node from '../node/Node.js';
import type SVGElement from '../svg-element/SVGElement.js';
import type Text from '../text/Text.js';

/**
 * HTMLElement utility.
 */
export default class HTMLElementUtility {
	/**
	 * Triggers a blur event.
	 *
	 * @param element Element.
	 */
	public static blur(element: HTMLElement | SVGElement): void {
		const target = element[PropertySymbol.proxy] || element;
		const document = target[PropertySymbol.ownerDocument];

		if (
			document[PropertySymbol.activeElement] !== target ||
			!target[PropertySymbol.isConnected] ||
			(<any>target).disabled
		) {
			return;
		}

		const relatedTarget = document[PropertySymbol.nextActiveElement] ?? null;

		document[PropertySymbol.activeElement] = null;

		document[PropertySymbol.clearCache]();

		target.dispatchEvent(
			new FocusEvent('blur', {
				relatedTarget,
				bubbles: false,
				composed: true,
				cancelable: true
			})
		);
		target.dispatchEvent(
			new FocusEvent('focusout', {
				relatedTarget,
				bubbles: true,
				composed: true,
				cancelable: true
			})
		);
	}

	/**
	 * Triggers a focus event.
	 *
	 * @param element Element.
	 */
	public static focus(element: HTMLElement | SVGElement): void {
		const target = element[PropertySymbol.proxy] || element;
		const document = target[PropertySymbol.ownerDocument];

		if (
			document[PropertySymbol.activeElement] === target ||
			!target[PropertySymbol.isConnected] ||
			(<any>target).disabled ||
			this.isInert(<HTMLElement | SVGElement>target)
		) {
			return;
		}

		// Set the next active element so `blur` can use it for `relatedTarget`.
		document[PropertySymbol.nextActiveElement] = <HTMLElement>target;

		const relatedTarget = document[PropertySymbol.activeElement];

		if (document[PropertySymbol.activeElement] !== null) {
			document[PropertySymbol.activeElement].blur();
		}

		// Clean up after blur, so it does not affect next blur call.
		document[PropertySymbol.nextActiveElement] = null;

		document[PropertySymbol.activeElement] = <HTMLElement>target;

		document[PropertySymbol.clearCache]();

		target.dispatchEvent(
			new FocusEvent('focus', {
				relatedTarget,
				bubbles: false,
				composed: true
			})
		);
		target.dispatchEvent(
			new FocusEvent('focusin', {
				relatedTarget,
				bubbles: true,
				composed: true
			})
		);

		if ((<HTMLElement>target).isContentEditable) {
			const firstText = HTMLElementUtility.findFirstEditableTextNode(<HTMLElement>target);
			const sel = target[PropertySymbol.ownerDocument].getSelection();
			if (firstText) {
				sel?.collapse(firstText, 0);
			} else {
				sel?.collapse(<HTMLElement>target, 0);
			}
		}
	}

	/**
	 * Returns the first Text node that is not inside a contenteditable=false subtree.
	 *
	 * @param root Root element to search within.
	 * @returns First editable Text node, or null if none exists.
	 */
	private static findFirstEditableTextNode(root: HTMLElement): Text | null {
		const walker = root[PropertySymbol.ownerDocument].createTreeWalker(root, NodeFilter.SHOW_ALL, {
			acceptNode(node: Node): number {
				if (
					node !== root &&
					node.nodeType === NodeTypeEnum.elementNode &&
					(<Element>node).contentEditable === 'false'
				) {
					return NodeFilter.FILTER_REJECT;
				}
				return node.nodeType === NodeTypeEnum.textNode
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP;
			}
		});
		return <Text | null>walker.nextNode();
	}

	/**
	 * Returns whether an element or any of its ancestors has the inert attribute.
	 *
	 * @param element Element to check.
	 * @returns True if the element is in an inert tree.
	 */
	private static isInert(element: HTMLElement | SVGElement): boolean {
		let current: HTMLElement | SVGElement | null = <HTMLElement | SVGElement>(
			(element[PropertySymbol.proxy] || element)
		);
		while (current && typeof current.getAttribute === 'function') {
			if (current.getAttribute('inert') !== null) {
				return true;
			}
			current = <HTMLElement | SVGElement | null>current[PropertySymbol.parentNode];
		}
		return false;
	}
}
