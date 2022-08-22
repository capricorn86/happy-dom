import IShadowRoot from '../../../nodes/shadow-root/IShadowRoot';
import CSSStyleSheet from '../../../css/CSSStyleSheet';
import IElement from '../../../nodes/element/IElement';
import IDocument from '../../../nodes/document/IDocument';
import IHTMLElement from '../../../nodes/html-element/IHTMLElement';
import IHTMLStyleElement from '../../../nodes/html-style-element/IHTMLStyleElement';
import INode from '../../../nodes/node/INode';
import INodeList from '../../../nodes/node/INodeList';
import CSSStyleDeclarationPropertyManager from './CSSStyleDeclarationPropertyManager';

const INHERITED_PROPERTIES = [
	'border-collapse',
	'border-spacing',
	'caption-side',
	'color',
	'cursor',
	'direction',
	'empty-cells',
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font-size-adjust',
	'font-stretch',
	'font',
	'letter-spacing',
	'line-height',
	'list-style-image',
	'list-style-position',
	'list-style-type',
	'list-style',
	'orphans',
	'quotes',
	'tab-size',
	'text-align',
	'text-align-last',
	'text-decoration-color',
	'text-indent',
	'text-justify',
	'text-shadow',
	'text-transform',
	'visibility',
	'white-space',
	'widows',
	'word-break',
	'word-spacing',
	'word-wrap'
];

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationElement {
	/**
	 * Returns element style properties.
	 *
	 * @param element Element.
	 * @param [computed] Computed.
	 * @returns Element style properties.
	 */
	public static getElementStyle(element: IElement, computed: boolean): string {
		let style = '';
		if (computed) {
			style += this.getStyleSheetElementStyle(element);
		}
		if (element['_attributes']['style'] && element['_attributes']['style'].value) {
			style += element['_attributes']['style'].value;
		}

		return style ? style : null;
	}

	/**
	 * Returns style sheet element style.
	 *
	 * @param element Element.
	 * @returns Style sheet element style.
	 */
	private static getStyleSheetElementStyle(element: IElement): string {
		const elements = this.getElementsWithStyle(element);
		const inherited = {};

		for (const element of elements) {
			const propertyManager = new CSSStyleDeclarationPropertyManager(element.cssText);
			Object.assign(propertyManager.properties, inherited);
			for (const name of Object.keys(propertyManager.properties)) {
				if (INHERITED_PROPERTIES.includes(name)) {
					inherited[name] = propertyManager.properties[name];
				}
			}
		}
	}

	/**
	 * Returns style sheets.
	 *
	 * @param element Element.
	 * @returns Style sheets.
	 */
	private static getElementsWithStyle(
		element: IElement
	): Array<{ element: IElement; cssText: string }> {
		const elements: Array<{ element: IElement; cssText: string }> = [{ element, cssText: null }];
		let shadowRootElements: Array<{ element: IElement; cssText: string }> = [
			{ element, cssText: null }
		];
		let parent: INode | IShadowRoot = <INode | IShadowRoot>element.parentNode;

		while (parent) {
			const styleAndElement = { element, cssText: null };
			elements.unshift(styleAndElement);
			shadowRootElements.unshift(styleAndElement);

			parent = <INode | IShadowRoot>parent.parentNode;

			if (!parent) {
				if ((<IShadowRoot>parent).host) {
					const styleSheets = <INodeList<IHTMLStyleElement>>(
						(<IShadowRoot>parent).host.querySelectorAll('style')
					);
					for (const styleSheet of styleSheets) {
						this.applyStyle(shadowRootElements, styleSheet.sheet);
					}
					parent = (<IShadowRoot>parent).host;
					shadowRootElements = [];
				}
			}
		}

		return elements;
	}

	/**
	 * Returns style sheets.
	 *
	 * @param elements Elements.
	 * @param styleSheet Style sheet.
	 */
	private static applyStyle(
		elements: Array<{ element: IElement; cssText: string }>,
		styleSheet: CSSStyleSheet
	): void {
		for (const rule of styleSheet.cssRules) {
			for (const element of elements) {
				const firstBracket = rule.cssText.indexOf('{');
				const lastBracket = rule.cssText.lastIndexOf('}');
				const cssText = rule.cssText.substring(firstBracket + 1, lastBracket);
				if (element.element.matches(rule.cssText.substring(0, firstBracket))) {
					element.cssText += cssText;
				}
			}
		}
	}
}
