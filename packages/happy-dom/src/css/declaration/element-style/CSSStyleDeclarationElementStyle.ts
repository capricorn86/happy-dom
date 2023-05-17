import IShadowRoot from '../../../nodes/shadow-root/IShadowRoot';
import IElement from '../../../nodes/element/IElement';
import IDocument from '../../../nodes/document/IDocument';
import IHTMLStyleElement from '../../../nodes/html-style-element/IHTMLStyleElement';
import INodeList from '../../../nodes/node/INodeList';
import CSSStyleDeclarationPropertyManager from '../property-manager/CSSStyleDeclarationPropertyManager';
import NodeTypeEnum from '../../../nodes/node/NodeTypeEnum';
import CSSRuleTypeEnum from '../../CSSRuleTypeEnum';
import CSSMediaRule from '../../rules/CSSMediaRule';
import CSSRule from '../../CSSRule';
import CSSStyleRule from '../../rules/CSSStyleRule';
import CSSStyleDeclarationElementDefaultCSS from './config/CSSStyleDeclarationElementDefaultCSS';
import CSSStyleDeclarationElementInheritedProperties from './config/CSSStyleDeclarationElementInheritedProperties';
import CSSStyleDeclarationCSSParser from '../css-parser/CSSStyleDeclarationCSSParser';
import QuerySelector from '../../../query-selector/QuerySelector';
import CSSMeasurementConverter from '../measurement-converter/CSSMeasurementConverter';

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
		const propertyManager = new CSSStyleDeclarationPropertyManager();
		const contextProperties: {
			rootFontSize: string | null;
			parentFontSize: string | null;
			cssVariables: { [k: string]: string };
		} = {
			rootFontSize: null,
			parentFontSize: null,
			cssVariables: {}
		};

		for (const parentElement of parentElements) {
			parentElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

			let elementCSSText = '';
			if (CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName]) {
				elementCSSText +=
					CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName];
			}

			for (const cssText of parentElement.cssTexts) {
				elementCSSText += cssText.cssText;
			}

			if (parentElement.element['_attributes']['style']?.value) {
				elementCSSText += parentElement.element['_attributes']['style'].value;
			}

			CSSStyleDeclarationCSSParser.parse(elementCSSText, (name, value, important) => {
				if (name.startsWith('--')) {
					const cssValue = this.getCSSValue(value, contextProperties);
					if (cssValue) {
						contextProperties.cssVariables[name] = cssValue;
					}
					return;
				}

				if (
					CSSStyleDeclarationElementInheritedProperties[name] ||
					parentElement === targetElement
				) {
					const cssValue = this.getCSSValue(value, contextProperties);
					if (cssValue && (!propertyManager.get(name)?.important || important)) {
						propertyManager.set(name, cssValue, important);
						const fontSize = propertyManager.get('font-size');
						if (fontSize !== null) {
							if ((<IElement>parentElement.element).tagName === 'HTML') {
								contextProperties.rootFontSize = fontSize.value;
							} else if (parentElement !== targetElement) {
								contextProperties.parentFontSize = fontSize.value;
							}
						}
					}
				}
			});
		}

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
							// Skip @-rules.
							if (selectorText.startsWith('@')) {
								continue;
							}
							const matchResult = QuerySelector.match(<IElement>element.element, selectorText);
							if (matchResult) {
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
	 * @param contextProperties Context properties.
	 * @param contextProperties.rootFontSize Root font size.
	 * @param contextProperties.parentFontSize Parent font size.
	 * @param contextProperties.cssVariables CSS variables.
	 * @returns CSS value.
	 */
	private getCSSValue(
		value: string,
		contextProperties: {
			rootFontSize: string | null;
			parentFontSize: string | null;
			cssVariables: { [k: string]: string };
		}
	): string {
		const regexp = new RegExp(CSS_VARIABLE_REGEXP);
		let newValue = value;
		let match;

		while ((match = regexp.exec(value)) !== null) {
			const cssVariableValue = contextProperties.cssVariables[match[1]];
			if (!cssVariableValue) {
				return null;
			}
			newValue = newValue.replace(match[0], cssVariableValue);
		}

		const valueInPixels = CSSMeasurementConverter.toPixels({
			ownerWindow: this.element.ownerDocument.defaultView,
			value: newValue,
			rootFontSize: contextProperties.rootFontSize || 16,
			parentFontSize: contextProperties.parentFontSize || 16
		});

		if (valueInPixels !== null) {
			return valueInPixels + 'px';
		}

		return newValue;
	}
}
