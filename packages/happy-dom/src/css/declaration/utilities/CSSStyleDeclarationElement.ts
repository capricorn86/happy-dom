import IShadowRoot from '../../../nodes/shadow-root/IShadowRoot';
import IElement from '../../../nodes/element/IElement';
import IDocument from '../../../nodes/document/IDocument';
import IHTMLStyleElement from '../../../nodes/html-style-element/IHTMLStyleElement';
import INodeList from '../../../nodes/node/INodeList';
import CSSStyleDeclarationPropertyManager from './CSSStyleDeclarationPropertyManager';
import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';
import NodeTypeEnum from '../../../nodes/node/NodeTypeEnum';
import CSSRuleTypeEnum from '../../CSSRuleTypeEnum';
import CSSMediaRule from '../../rules/CSSMediaRule';
import CSSRule from '../../CSSRule';
import CSSStyleRule from '../../rules/CSSStyleRule';
import CSSStyleDeclarationElementDefaultProperties from './CSSStyleDeclarationElementDefaultProperties';
import CSSStyleDeclarationElementInheritedProperties from './CSSStyleDeclarationElementInheritedProperties';

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
	public static getElementStyle(
		element: IElement,
		computed: boolean
	): CSSStyleDeclarationPropertyManager {
		if (computed) {
			return this.getComputedElementStyle(element);
		}

		return new CSSStyleDeclarationPropertyManager(element['_attributes']['style']?.value);
	}

	/**
	 * Returns style sheets.
	 *
	 * @param element Element.
	 * @returns Style sheets.
	 */
	private static getComputedElementStyle(element: IElement): CSSStyleDeclarationPropertyManager {
		const parentElements: Array<{ element: IElement; cssText: string }> = [];
		const inheritedProperties: { [k: string]: ICSSStyleDeclarationPropertyValue } = {};
		let styleAndElement = { element: <IElement | IShadowRoot | IDocument>element, cssText: '' };
		let shadowRootElements: Array<{ element: IElement; cssText: string }> = [];

		if (!element.isConnected) {
			return new CSSStyleDeclarationPropertyManager();
		}

		while (styleAndElement.element) {
			if (styleAndElement.element.nodeType === NodeTypeEnum.elementNode) {
				parentElements.unshift(<{ element: IElement; cssText: string }>styleAndElement);
				shadowRootElements.unshift(<{ element: IElement; cssText: string }>styleAndElement);
			}

			if (styleAndElement.element === element.ownerDocument) {
				const styleSheets = <INodeList<IHTMLStyleElement>>(
					element.ownerDocument.querySelectorAll('style')
				);

				for (const styleSheet of styleSheets) {
					this.applyCSSTextToElements(parentElements, styleSheet.sheet.cssRules);
				}

				styleAndElement = { element: null, cssText: '' };
			} else if ((<IShadowRoot>styleAndElement.element).host) {
				const styleSheets = <INodeList<IHTMLStyleElement>>(
					(<IShadowRoot>styleAndElement.element).querySelectorAll('style')
				);
				styleAndElement = {
					element: <IElement>(<IShadowRoot>styleAndElement.element).host,
					cssText: ''
				};
				for (const styleSheet of styleSheets) {
					this.applyCSSTextToElements(
						shadowRootElements,
						styleSheet.sheet.cssRules,
						<{ element: IElement; cssText: string }>styleAndElement
					);
				}
				shadowRootElements = [];
			} else {
				styleAndElement = { element: <IElement>styleAndElement.element.parentNode, cssText: '' };
			}
		}

		const targetElement = parentElements[parentElements.length - 1];

		for (const parentElement of parentElements) {
			if (parentElement !== targetElement) {
				const propertyManager = new CSSStyleDeclarationPropertyManager(
					parentElement.cssText + (parentElement.element['_attributes']['style']?.value || '')
				);
				const properties = Object.assign(
					{},
					CSSStyleDeclarationElementDefaultProperties.default,
					CSSStyleDeclarationElementDefaultProperties[parentElement.element.tagName],
					propertyManager.properties
				);
				for (const name of Object.keys(properties)) {
					if (CSSStyleDeclarationElementInheritedProperties.includes(name)) {
						if (!inheritedProperties[name]?.important || properties[name].important) {
							inheritedProperties[name] = properties[name];
						}
					}
				}
			}
		}

		const targetPropertyManager = new CSSStyleDeclarationPropertyManager(
			targetElement.cssText + (targetElement.element['_attributes']['style']?.value || '')
		);

		const targetProperties = Object.assign(
			{},
			CSSStyleDeclarationElementDefaultProperties.default,
			CSSStyleDeclarationElementDefaultProperties[targetElement.element.tagName],
			inheritedProperties
		);

		for (const name of Object.keys(targetPropertyManager.properties)) {
			if (!targetProperties[name]?.important || targetPropertyManager.properties[name].important) {
				targetProperties[name] = targetPropertyManager.properties[name];
			}
		}

		targetPropertyManager.properties = targetProperties;

		return targetPropertyManager;
	}

	/**
	 * Applies CSS text to elements.
	 *
	 * @param elements Elements.
	 * @param cssRules CSS rules.
	 * @param [hostElement] Host element.
	 * @param [hostElement.element] Element.
	 * @param [hostElement.cssText] CSS text.
	 */
	private static applyCSSTextToElements(
		elements: Array<{ element: IElement; cssText: string }>,
		cssRules: CSSRule[],
		hostElement?: { element: IElement; cssText: string }
	): void {
		if (!elements.length) {
			return;
		}

		const defaultView = elements[0].element.ownerDocument.defaultView;

		for (const rule of cssRules) {
			if (rule.type === CSSRuleTypeEnum.styleRule) {
				for (const element of elements) {
					const selectorText: string = (<CSSStyleRule>rule).selectorText;

					if (selectorText) {
						if (hostElement && selectorText.startsWith(':host')) {
							const firstBracket = rule.cssText.indexOf('{');
							const lastBracket = rule.cssText.lastIndexOf('}');
							hostElement.cssText += rule.cssText.substring(firstBracket + 1, lastBracket);
						} else if (element.element.matches(selectorText)) {
							const firstBracket = rule.cssText.indexOf('{');
							const lastBracket = rule.cssText.lastIndexOf('}');
							element.cssText += rule.cssText.substring(firstBracket + 1, lastBracket);
						}
					}
				}
			} else if (
				rule.type === CSSRuleTypeEnum.mediaRule &&
				defaultView.matchMedia((<CSSMediaRule>rule).conditionalText).matches
			) {
				this.applyCSSTextToElements(elements, (<CSSMediaRule>rule).cssRules);
			}
		}
	}
}
