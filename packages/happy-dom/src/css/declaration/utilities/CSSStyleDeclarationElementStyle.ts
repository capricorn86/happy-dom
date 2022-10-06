import IShadowRoot from '../../../nodes/shadow-root/IShadowRoot';
import IElement from '../../../nodes/element/IElement';
import IDocument from '../../../nodes/document/IDocument';
import IHTMLStyleElement from '../../../nodes/html-style-element/IHTMLStyleElement';
import INodeList from '../../../nodes/node/INodeList';
import CSSStyleDeclarationPropertyManager from './CSSStyleDeclarationPropertyManager';
import NodeTypeEnum from '../../../nodes/node/NodeTypeEnum';
import CSSRuleTypeEnum from '../../CSSRuleTypeEnum';
import CSSMediaRule from '../../rules/CSSMediaRule';
import CSSRule from '../../CSSRule';
import CSSStyleRule from '../../rules/CSSStyleRule';
import CSSStyleDeclarationElementDefaultCSS from './CSSStyleDeclarationElementDefaultCSS';
import CSSStyleDeclarationElementInheritedProperties from './CSSStyleDeclarationElementInheritedProperties';
import CSSStyleDeclarationCSSParser from './CSSStyleDeclarationCSSParser';

const CSS_VARIABLE_REGEXP = /var\( *(--[^) ]+)\)/g;

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationElementStyle {
	private cache: { [k: string]: CSSStyleDeclarationPropertyManager } = {};
	private element: IElement;
	private computed: boolean;

	/**
	 * Constructor.
	 *
	 * @param element Element.
	 * @param [computed] Computed.
	 */
	constructor(element: IElement, computed = false) {
		this.element = element;
		this.computed = computed;
	}

	/**
	 * Returns element style properties.
	 *
	 * @returns Element style properties.
	 */
	public getElementStyle(): CSSStyleDeclarationPropertyManager {
		if (this.computed) {
			return this.getComputedElementStyle();
		}

		const cssText = this.element['_attributes']['style']?.value;

		if (cssText) {
			if (this.cache[cssText]) {
				return this.cache[cssText];
			}
			this.cache[cssText] = new CSSStyleDeclarationPropertyManager({ cssText });
			return this.cache[cssText];
		}

		return new CSSStyleDeclarationPropertyManager();
	}

	/**
	 * Returns style sheets.
	 *
	 * @param element Element.
	 * @returns Style sheets.
	 */
	private getComputedElementStyle(): CSSStyleDeclarationPropertyManager {
		const documentElements: Array<{ element: IElement; cssText: string }> = [];
		const parentElements: Array<{ element: IElement; cssText: string }> = [];
		let styleAndElement = {
			element: <IElement | IShadowRoot | IDocument>this.element,
			cssText: ''
		};
		let shadowRootElements: Array<{ element: IElement; cssText: string }> = [];

		if (!this.element.isConnected) {
			return new CSSStyleDeclarationPropertyManager();
		}

		// Walks through all parent elements and stores them in an array with element and matching CSS text.
		while (styleAndElement.element) {
			if (styleAndElement.element.nodeType === NodeTypeEnum.elementNode) {
				const rootNode = styleAndElement.element.getRootNode();
				if (rootNode.nodeType === NodeTypeEnum.documentNode) {
					documentElements.unshift(<{ element: IElement; cssText: string }>styleAndElement);
				} else {
					shadowRootElements.unshift(<{ element: IElement; cssText: string }>styleAndElement);
				}
				parentElements.unshift(<{ element: IElement; cssText: string }>styleAndElement);
			}

			if (styleAndElement.element === this.element.ownerDocument) {
				const styleSheets = <INodeList<IHTMLStyleElement>>(
					this.element.ownerDocument.querySelectorAll('style,link[rel="stylesheet"]')
				);

				for (const styleSheet of styleSheets) {
					const sheet = styleSheet.sheet;
					if (sheet) {
						this.parseCSSRules({
							elements: documentElements,
							cssRules: sheet.cssRules
						});
					}
				}

				styleAndElement = { element: null, cssText: '' };
			} else if ((<IShadowRoot>styleAndElement.element).host) {
				const styleSheets = <INodeList<IHTMLStyleElement>>(
					(<IShadowRoot>styleAndElement.element).querySelectorAll('style,link[rel="stylesheet"]')
				);

				styleAndElement = {
					element: <IElement>(<IShadowRoot>styleAndElement.element).host,
					cssText: ''
				};

				for (const styleSheet of styleSheets) {
					const sheet = styleSheet.sheet;
					if (sheet) {
						this.parseCSSRules({
							elements: shadowRootElements,
							cssRules: sheet.cssRules,
							hostElement: <{ element: IElement; cssText: string }>styleAndElement
						});
					}
				}
				shadowRootElements = [];
			} else {
				styleAndElement = { element: <IElement>styleAndElement.element.parentNode, cssText: '' };
			}
		}

		// Concatenates all parent element CSS to one string.
		const targetElement = parentElements[parentElements.length - 1];
		let inheritedCSSText = CSSStyleDeclarationElementDefaultCSS.default;

		for (const parentElement of parentElements) {
			if (parentElement !== targetElement) {
				inheritedCSSText +=
					(CSSStyleDeclarationElementDefaultCSS[parentElement.element.tagName] || '') +
					parentElement.cssText +
					(parentElement.element['_attributes']['style']?.value || '');
			}
		}

		const cssVariables: { [k: string]: string } = {};
		const properties = {};
		const targetCSSText =
			(CSSStyleDeclarationElementDefaultCSS[targetElement.element.tagName] || '') +
			targetElement.cssText +
			(targetElement.element['_attributes']['style']?.value || '');
		const combinedCSSText = inheritedCSSText + targetCSSText;

		if (this.cache[combinedCSSText]) {
			return this.cache[combinedCSSText];
		}

		// Parses the parent element CSS and stores CSS variables and inherited properties.
		CSSStyleDeclarationCSSParser.parse(inheritedCSSText, (name, value, important) => {
			if (name.startsWith('--')) {
				const cssValue = this.getCSSValue(value, cssVariables);
				if (cssValue) {
					cssVariables[name] = cssValue;
				}
				return;
			}

			if (CSSStyleDeclarationElementInheritedProperties[name]) {
				const cssValue = this.getCSSValue(value, cssVariables);
				if (cssValue && (!properties[name]?.important || important)) {
					properties[name] = {
						value: cssValue,
						important
					};
				}
			}
		});

		// Parses the target element CSS.
		CSSStyleDeclarationCSSParser.parse(targetCSSText, (name, value, important) => {
			if (name.startsWith('--')) {
				const cssValue = this.getCSSValue(value, cssVariables);
				if (cssValue && (!properties[name]?.important || important)) {
					cssVariables[name] = cssValue;
					properties[name] = {
						value,
						important
					};
				}
			} else {
				const cssValue = this.getCSSValue(value, cssVariables);
				if (cssValue && (!properties[name]?.important || important)) {
					properties[name] = {
						value: cssValue,
						important
					};
				}
			}
		});

		const propertyManager = new CSSStyleDeclarationPropertyManager();

		for (const name of Object.keys(properties)) {
			propertyManager.set(name, properties[name].value, properties[name].important);
		}

		this.cache[combinedCSSText] = propertyManager;

		return propertyManager;
	}

	/**
	 * Applies CSS text to elements.
	 *
	 * @param options Options.
	 * @param options.elements Elements.
	 * @param options.cssRules CSS rules.
	 * @param [options.hostElement] Host element.
	 * @param [options.hostElement.element] Element.
	 * @param [options.hostElement.cssText] CSS text.
	 */
	private parseCSSRules(options: {
		cssRules: CSSRule[];
		elements: Array<{ element: IElement; cssText: string }>;
		hostElement?: { element: IElement; cssText: string };
	}): void {
		if (!options.elements.length) {
			return;
		}

		const defaultView = options.elements[0].element.ownerDocument.defaultView;

		for (const rule of options.cssRules) {
			if (rule.type === CSSRuleTypeEnum.styleRule) {
				const selectorText: string = (<CSSStyleRule>rule).selectorText;
				if (selectorText) {
					if (selectorText.startsWith(':host')) {
						if (options.hostElement) {
							options.hostElement.cssText += (<CSSStyleRule>rule)._cssText;
						}
					} else {
						for (const element of options.elements) {
							if (element.element.matches(selectorText)) {
								element.cssText += (<CSSStyleRule>rule)._cssText;
							}
						}
					}
				}
			} else if (
				rule.type === CSSRuleTypeEnum.mediaRule &&
				defaultView.matchMedia((<CSSMediaRule>rule).conditionalText).matches
			) {
				this.parseCSSRules({
					elements: options.elements,
					cssRules: (<CSSMediaRule>rule).cssRules,
					hostElement: options.hostElement
				});
			}
		}
	}

	/**
	 * Returns CSS value.
	 *
	 * @param value Value.
	 * @param cssVariables CSS variables.
	 * @returns CSS value.
	 */
	private getCSSValue(value: string, cssVariables: { [k: string]: string }): string {
		const regexp = new RegExp(CSS_VARIABLE_REGEXP);
		let newValue = value;
		let match;
		while ((match = regexp.exec(value)) !== null) {
			const cssVariableValue = cssVariables[match[1]];
			if (!cssVariableValue) {
				return null;
			}
			newValue = newValue.replace(match[0], cssVariableValue);
		}
		return newValue;
	}
}
