import IShadowRoot from '../../../nodes/shadow-root/IShadowRoot.js';
import IElement from '../../../nodes/element/IElement.js';
import IDocument from '../../../nodes/document/IDocument.js';
import IHTMLStyleElement from '../../../nodes/html-style-element/IHTMLStyleElement.js';
import INodeList from '../../../nodes/node/INodeList.js';
import CSSStyleDeclarationPropertyManager from '../property-manager/CSSStyleDeclarationPropertyManager.js';
import NodeTypeEnum from '../../../nodes/node/NodeTypeEnum.js';
import CSSRuleTypeEnum from '../../CSSRuleTypeEnum.js';
import CSSMediaRule from '../../rules/CSSMediaRule.js';
import CSSRule from '../../CSSRule.js';
import CSSStyleRule from '../../rules/CSSStyleRule.js';
import CSSStyleDeclarationElementDefaultCSS from './config/CSSStyleDeclarationElementDefaultCSS.js';
import CSSStyleDeclarationElementInheritedProperties from './config/CSSStyleDeclarationElementInheritedProperties.js';
import CSSStyleDeclarationElementMeasurementProperties from './config/CSSStyleDeclarationElementMeasurementProperties.js';
import CSSStyleDeclarationCSSParser from '../css-parser/CSSStyleDeclarationCSSParser.js';
import QuerySelector from '../../../query-selector/QuerySelector.js';
import CSSMeasurementConverter from '../measurement-converter/CSSMeasurementConverter.js';
import MediaQueryList from '../../../match-media/MediaQueryList.js';

const CSS_VARIABLE_REGEXP = /var\( *(--[^) ]+)\)/g;
const CSS_MEASUREMENT_REGEXP = /[0-9.]+(px|rem|em|vw|vh|%|vmin|vmax|cm|mm|in|pt|pc|Q)/g;

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

		const cssText = this.element.attributes['style']?.value;

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
		const cssVariables: { [k: string]: string } = {};
		let rootFontSize: string | number = 16;
		let parentFontSize: string | number = 16;

		for (const parentElement of parentElements) {
			parentElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

			let elementCSSText = '';
			if (CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName]) {
				if (
					typeof CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName] ===
					'string'
				) {
					elementCSSText +=
						CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName];
				} else {
					for (const key of Object.keys(
						CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName]
					)) {
						if (key === 'default' || !!parentElement.element[key]) {
							elementCSSText +=
								CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName][
									key
								];
						}
					}
				}
				elementCSSText +=
					CSSStyleDeclarationElementDefaultCSS[(<IElement>parentElement.element).tagName];
			}

			for (const cssText of parentElement.cssTexts) {
				elementCSSText += cssText.cssText;
			}

			const elementStyleAttribute = (<IElement>parentElement.element).attributes['style'];
			if (elementStyleAttribute) {
				elementCSSText += elementStyleAttribute.value;
			}

			CSSStyleDeclarationCSSParser.parse(elementCSSText, (name, value, important) => {
				const isCSSVariable = name.startsWith('--');
				if (
					isCSSVariable ||
					CSSStyleDeclarationElementInheritedProperties[name] ||
					parentElement === targetElement
				) {
					const cssValue = this.parseCSSVariablesInValue(value, cssVariables);
					if (cssValue && (!propertyManager.get(name)?.important || important)) {
						propertyManager.set(name, cssValue, important);

						if (isCSSVariable) {
							cssVariables[name] = cssValue;
						} else if (name === 'font' || name === 'font-size') {
							const fontSize = propertyManager.properties['font-size'];
							if (fontSize !== null) {
								const parsedValue = this.parseMeasurementsInValue({
									value: fontSize.value,
									rootFontSize,
									parentFontSize,
									parentSize: parentFontSize
								});
								if ((<IElement>parentElement.element).tagName === 'HTML') {
									rootFontSize = parsedValue;
								} else if (parentElement !== targetElement) {
									parentFontSize = parsedValue;
								}
							}
						}
					}
				}
			});
		}

		for (const name of CSSStyleDeclarationElementMeasurementProperties) {
			const property = propertyManager.properties[name];
			if (property) {
				property.value = this.parseMeasurementsInValue({
					value: property.value,
					rootFontSize,
					parentFontSize,

					// TODO: Only "font-size" is supported when using percentage values. Add support for other properties.
					parentSize: name === 'font-size' ? parentFontSize : null
				});
			}
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

		const ownerWindow = this.element.ownerDocument.defaultView;

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
				// TODO: We need to send in a predfined root font size as it will otherwise be calculated using Window.getComputedStyle(), which will cause a never ending loop. Is there another solution?
				new MediaQueryList({
					ownerWindow,
					media: (<CSSMediaRule>rule).conditionText,
					rootFontSize: this.element.tagName === 'HTML' ? 16 : null
				}).matches
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
	 * Parses CSS variables in a value.
	 *
	 * @param value Value.
	 * @param cssVariables CSS variables.
	 * @returns CSS value.
	 */
	private parseCSSVariablesInValue(value: string, cssVariables: { [k: string]: string }): string {
		const regexp = new RegExp(CSS_VARIABLE_REGEXP);
		let newValue = value;
		let match;

		while ((match = regexp.exec(value)) !== null) {
			newValue = newValue.replace(match[0], cssVariables[match[1]] || '');
		}

		return newValue;
	}

	/**
	 * Parses measurements in a value.
	 *
	 * @param options Options.
	 * @param options.value Value.
	 * @param options.rootFontSize Root font size.
	 * @param options.parentFontSize Parent font size.
	 * @param [options.parentSize] Parent width.
	 * @returns CSS value.
	 */
	private parseMeasurementsInValue(options: {
		value: string;
		rootFontSize: string | number;
		parentFontSize: string | number;
		parentSize: string | number | null;
	}): string {
		if (this.element.ownerDocument.defaultView.happyDOM.settings.disableComputedStyleRendering) {
			return options.value;
		}

		const regexp = new RegExp(CSS_MEASUREMENT_REGEXP);
		let newValue = options.value;
		let match;

		while ((match = regexp.exec(options.value)) !== null) {
			if (match[1] !== 'px') {
				const valueInPixels = CSSMeasurementConverter.toPixels({
					ownerWindow: this.element.ownerDocument.defaultView,
					value: match[0],
					rootFontSize: options.rootFontSize,
					parentFontSize: options.parentFontSize,
					parentSize: options.parentSize
				});

				if (valueInPixels !== null) {
					newValue = newValue.replace(match[0], valueInPixels + 'px');
				}
			}
		}

		return newValue;
	}
}
