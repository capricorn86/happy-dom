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
import QuerySelector from '../../../query-selector/QuerySelector';

const CSS_VARIABLE_REGEXP = /var\( *(--[^) ]+)\)/g;

type IStyleAndElement = {
	element: IElement | IShadowRoot | IDocument;
	cssTexts: Array<{ cssText: string; priorityWeight: number }>;
};

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationElementStyle {
	private cache: {
		propertyManager: CSSStyleDeclarationPropertyManager;
		cssText: string;
		documentCacheID: number;
	} = {
		propertyManager: null,
		cssText: null,
		documentCacheID: null
	};

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
			if (this.cache.propertyManager && this.cache.cssText === cssText) {
				return this.cache.propertyManager;
			}
			this.cache.cssText = cssText;
			this.cache.propertyManager = new CSSStyleDeclarationPropertyManager({ cssText });
			return this.cache.propertyManager;
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
		const documentElements: Array<IStyleAndElement> = [];
		const parentElements: Array<IStyleAndElement> = [];
		let styleAndElement: IStyleAndElement = {
			element: <IElement | IShadowRoot | IDocument>this.element,
			cssTexts: []
		};
		let shadowRootElements: Array<IStyleAndElement> = [];

		if (!this.element.isConnected) {
			return new CSSStyleDeclarationPropertyManager();
		}

		if (
			this.cache.propertyManager &&
			this.cache.documentCacheID === this.element.ownerDocument['_cacheID']
		) {
			return this.cache.propertyManager;
		}

		this.cache.documentCacheID = this.element.ownerDocument['_cacheID'];

		// Walks through all parent elements and stores them in an array with element and matching CSS text.
		while (styleAndElement.element) {
			if (styleAndElement.element.nodeType === NodeTypeEnum.elementNode) {
				const rootNode = styleAndElement.element.getRootNode();
				if (rootNode.nodeType === NodeTypeEnum.documentNode) {
					documentElements.unshift(styleAndElement);
				} else {
					shadowRootElements.unshift(styleAndElement);
				}
				parentElements.unshift(styleAndElement);
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

				styleAndElement = { element: null, cssTexts: [] };
			} else if (
				styleAndElement.element.nodeType === NodeTypeEnum.documentFragmentNode &&
				(<IShadowRoot>styleAndElement.element).host
			) {
				const styleSheets = <INodeList<IHTMLStyleElement>>(
					(<IShadowRoot>styleAndElement.element).querySelectorAll('style,link[rel="stylesheet"]')
				);

				styleAndElement = {
					element: <IElement>(<IShadowRoot>styleAndElement.element).host,
					cssTexts: []
				};

				for (const styleSheet of styleSheets) {
					const sheet = styleSheet.sheet;
					if (sheet) {
						this.parseCSSRules({
							elements: shadowRootElements,
							cssRules: sheet.cssRules,
							hostElement: styleAndElement
						});
					}
				}
				shadowRootElements = [];
			} else {
				styleAndElement = { element: <IElement>styleAndElement.element.parentNode, cssTexts: [] };
			}
		}

		// Concatenates all parent element CSS to one string.
		const targetElement = parentElements[parentElements.length - 1];
		let inheritedCSSText = '';

		for (const parentElement of parentElements) {
			if (parentElement !== targetElement) {
				parentElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

				if (CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName]) {
					inheritedCSSText +=
						CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName];
				}

				for (const cssText of parentElement.cssTexts) {
					inheritedCSSText += cssText.cssText;
				}

				if (parentElement.element['_attributes']['style']?.value) {
					inheritedCSSText += parentElement.element['_attributes']['style'].value;
				}
			}
		}

		const cssVariables: { [k: string]: string } = {};
		const properties = {};
		let targetCSSText =
			CSSStyleDeclarationElementDefaultCSS[(<IElement>targetElement.element).tagName] || '';

		targetElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

		for (const cssText of targetElement.cssTexts) {
			targetCSSText += cssText.cssText;
		}

		if (targetElement.element['_attributes']['style']?.value) {
			targetCSSText += targetElement.element['_attributes']['style'].value;
		}

		const combinedCSSText = inheritedCSSText + targetCSSText;

		if (this.cache.propertyManager && this.cache.cssText === combinedCSSText) {
			return this.cache.propertyManager;
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

		this.cache.cssText = combinedCSSText;
		this.cache.propertyManager = propertyManager;

		return propertyManager;
	}

	/**
	 * Applies CSS text to elements.
	 *
	 * @param options Options.
	 * @param options.elements Elements.
	 * @param options.cssRules CSS rules.
	 * @param [options.hostElement] Host element.
	 */
	private parseCSSRules(options: {
		cssRules: CSSRule[];
		elements: Array<IStyleAndElement>;
		hostElement?: IStyleAndElement;
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
							options.hostElement.cssTexts.push({
								cssText: (<CSSStyleRule>rule)._cssText,
								priorityWeight: 0
							});
						}
					} else {
						for (const element of options.elements) {
							const matchResult = QuerySelector.match(element.element, selectorText);
							if (matchResult.matches) {
								element.cssTexts.push({
									cssText: (<CSSStyleRule>rule)._cssText,
									priorityWeight: matchResult.priorityWeight
								});
							}
						}
					}
				}
			} else if (
				rule.type === CSSRuleTypeEnum.mediaRule &&
				defaultView.matchMedia((<CSSMediaRule>rule).conditionText).matches
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
