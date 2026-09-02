import type ShadowRoot from '../../../nodes/shadow-root/ShadowRoot.js';
import * as PropertySymbol from '../../../PropertySymbol.js';
import type Element from '../../../nodes/element/Element.js';
import type Document from '../../../nodes/document/Document.js';
import type HTMLStyleElement from '../../../nodes/html-style-element/HTMLStyleElement.js';
import type NodeList from '../../../nodes/node/NodeList.js';
import CSSPropertyManager from '../property-manager/CSSPropertyManager.js';
import NodeTypeEnum from '../../../nodes/node/NodeTypeEnum.js';
import CSSRuleTypeEnum from '../../CSSRuleTypeEnum.js';
import type CSSMediaRule from '../../rules/CSSMediaRule.js';
import type CSSRule from '../../CSSRule.js';
import type CSSStyleRule from '../../rules/CSSStyleRule.js';
import CSSComputedStyleElementDefault from './config/CSSComputedStyleElementDefault.js';
import CSSComputedStyleInheritedProperties from './config/CSSComputedStyleInheritedProperties.js';
import CSSComputedStyleMeasurementProperties from './config/CSSComputedStyleMeasurementProperties.js';
import CSSTextParser from '../utilities/CSSTextParser.js';
import QuerySelector from '../../../query-selector/QuerySelector.js';
import CSSMeasurementConverter from '../utilities/CSSMeasurementConverter.js';
import MediaQueryList from '../../../match-media/MediaQueryList.js';
import WindowBrowserContext from '../../../window/WindowBrowserContext.js';
import type CSSSupportsRule from '../../rules/CSSSupportsRule.js';
import CSSScopeRule from '../../rules/CSSScopeRule.js';
import type CSSStyleSheet from '../../CSSStyleSheet.js';
import CSSVariableFormatter from '../property-manager/utilities/CSSVariableFormatter.js';
import type HTMLElement from '../../../nodes/html-element/HTMLElement.js';

const CSS_MEASUREMENT_REGEXP = /[0-9.]+(px|rem|em|vw|vh|%|vmin|vmax|cm|mm|in|pt|pc|Q)/g;

type IStyleAndElement = {
	element: Element | ShadowRoot | Document | null;
	cssTexts: Array<{ cssText: string; priorityWeight: number }>;
};

/**
 * CSS Style Declaration utility
 */
export default class CSSComputedStyle {
	private element: Element;

	/**
	 * Constructor.
	 *
	 * @param element Element.
	 * @param [computed] Computed.
	 */
	constructor(element: Element) {
		this.element = element;
	}

	/**
	 * Returns style sheets.
	 *
	 * @param element Element.
	 * @returns Style sheets.
	 */
	public getComputedStyle(): CSSPropertyManager {
		const documentElements: Array<IStyleAndElement> = [];
		const parentElements: Array<IStyleAndElement> = [];
		let styleAndElement: IStyleAndElement = {
			element: <Element | ShadowRoot | Document>this.element,
			cssTexts: []
		};
		let shadowRootElements: Array<IStyleAndElement> = [];

		if (!this.element[PropertySymbol.isConnected]) {
			return new CSSPropertyManager();
		}

		const cacheResult = this.element[PropertySymbol.cache].computedStyle;

		if (cacheResult?.result) {
			const result = cacheResult.result.deref();
			if (result) {
				return result;
			}
		}

		// Walks through all parent elements and stores them in an array with element and matching CSS text.
		while (styleAndElement.element) {
			if (styleAndElement.element[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				const rootNode = styleAndElement.element.getRootNode();
				if (rootNode[PropertySymbol.nodeType] === NodeTypeEnum.documentNode) {
					documentElements.unshift(styleAndElement);
				} else {
					shadowRootElements.unshift(styleAndElement);
				}
				parentElements.unshift(styleAndElement);
			}

			if (styleAndElement.element === this.element[PropertySymbol.ownerDocument]) {
				const styleSheets = this.getStyleSheets(this.element[PropertySymbol.ownerDocument]);

				for (const styleSheet of styleSheets) {
					this.parseCSSRules({
						elements: documentElements,
						cssRules: styleSheet.cssRules
					});
				}
				styleAndElement = { element: null, cssTexts: [] };
			} else if (
				styleAndElement.element[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode &&
				(<ShadowRoot>styleAndElement.element).host
			) {
				const shadowRoot = <ShadowRoot>styleAndElement.element;
				const styleSheets = this.getStyleSheets(shadowRoot);

				styleAndElement = {
					element: <Element>shadowRoot.host,
					cssTexts: []
				};

				for (const styleSheet of styleSheets) {
					this.parseCSSRules({
						elements: shadowRootElements,
						cssRules: styleSheet.cssRules
					});
				}

				shadowRootElements = [];
			} else if (
				styleAndElement.element[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(<HTMLElement>styleAndElement.element).shadowRoot
			) {
				const shadowRoot = (<HTMLElement>styleAndElement.element).shadowRoot!;
				const styleSheets = this.getStyleSheets(shadowRoot);

				for (const styleSheet of styleSheets) {
					this.parseCSSRules({
						elements: [styleAndElement],
						cssRules: styleSheet.cssRules
					});
				}
				styleAndElement = {
					element: <Element>styleAndElement.element[PropertySymbol.parentNode],
					cssTexts: []
				};
			} else {
				styleAndElement = {
					element: <Element>styleAndElement.element[PropertySymbol.parentNode],
					cssTexts: []
				};
			}
		}

		// Concatenates all parent element CSS to one string.
		const targetElement = parentElements[parentElements.length - 1];
		const propertyManager = new CSSPropertyManager();
		const cssVariables: { [k: string]: string } = {};
		let rootFontSize: string | number = 16;
		let parentFontSize: string | number = 16;

		for (const parentElement of parentElements) {
			parentElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

			const defaultCSS = (<any>CSSComputedStyleElementDefault)[
				(<Element>parentElement.element)[PropertySymbol.tagName]!
			];
			let elementCSSText = '';

			if (defaultCSS) {
				if (typeof defaultCSS === 'string') {
					elementCSSText += defaultCSS;
				} else {
					for (const key of Object.keys(defaultCSS)) {
						if (key === 'default' || !!(<any>parentElement.element)[key]) {
							elementCSSText += defaultCSS[key];
						}
					}
				}
			}

			for (const cssText of parentElement.cssTexts) {
				elementCSSText += cssText.cssText;
			}

			const elementStyleAttribute = (<Element>parentElement.element).getAttribute('style');

			if (elementStyleAttribute) {
				elementCSSText += elementStyleAttribute;
			}

			const rulesAndVariables = CSSTextParser.parse(elementCSSText);
			const rules = rulesAndVariables.rules;

			Object.assign(cssVariables, rulesAndVariables.variables);

			for (const { name, value, important } of rules) {
				if ((<any>CSSComputedStyleInheritedProperties)[name] || parentElement === targetElement) {
					const parsedValue = CSSVariableFormatter.resolveVariables(value.trim(), cssVariables);

					if (
						parsedValue &&
						parsedValue !== 'inherit' &&
						(!propertyManager.get(name)?.important || important)
					) {
						propertyManager.set(name, parsedValue, important);

						if (name === 'font' || name === 'font-size') {
							const fontSize = propertyManager.properties['font-size'];
							if (fontSize !== null) {
								const parsedValue = this.parseMeasurementsInValue({
									value: fontSize.value,
									rootFontSize,
									parentFontSize,
									parentSize: parentFontSize
								});
								if ((<Element>parentElement.element)[PropertySymbol.tagName] === 'HTML') {
									rootFontSize = parsedValue;
								} else if (parentElement !== targetElement) {
									parentFontSize = parsedValue;
								}
							}
						}
					}
				}
			}
		}

		for (const name of CSSComputedStyleMeasurementProperties) {
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

		const cachedResult = {
			result: new WeakRef(propertyManager)
		};

		this.element[PropertySymbol.cache].computedStyle = cachedResult;
		this.element[PropertySymbol.ownerDocument][PropertySymbol.affectsComputedStyleCache].push(
			cachedResult
		);

		return propertyManager;
	}

	/**
	 * Returns style sheets.
	 *
	 * @param root Root element.
	 * @returns Style sheets.
	 */
	private getStyleSheets(root: Document | ShadowRoot | null): CSSStyleSheet[] {
		if (!root) {
			return [];
		}
		const styleElements = <NodeList<HTMLStyleElement>>(
			root.querySelectorAll('style,link[rel="stylesheet"]')
		);
		let styleSheets: CSSStyleSheet[] = [];

		for (const styleElement of styleElements) {
			const sheet = styleElement.sheet;
			if (sheet) {
				styleSheets.push(sheet);
			}
		}

		if ((<Document | ShadowRoot>root).adoptedStyleSheets) {
			styleSheets = styleSheets.concat((<Document | ShadowRoot>root).adoptedStyleSheets);
		}

		return styleSheets;
	}

	/**
	 * Applies CSS text to elements.
	 *
	 * @param options Options.
	 * @param options.elements Elements.
	 * @param options.cssRules CSS rules.
	 * @param [options.hostElement] Host element.
	 * @param [options.scopeElement] Scope element.
	 */
	private parseCSSRules(options: {
		cssRules: CSSRule[];
		elements: IStyleAndElement[];
		hostElement?: IStyleAndElement | null;
		scopeElement?: IStyleAndElement | null;
	}): void {
		if (!options.hostElement && !options.elements.length) {
			return;
		}

		const window = this.element[PropertySymbol.window];

		for (const rule of options.cssRules) {
			if (rule.type === CSSRuleTypeEnum.styleRule) {
				const selectorText: string = (<CSSStyleRule>rule).selectorText;
				if (selectorText) {
					for (const element of options.elements) {
						const match = QuerySelector.matches(<Element>element.element, selectorText, {
							ignoreErrors: true,
							scope: options.scopeElement?.element
						});
						if (match) {
							element.cssTexts.push({
								cssText: (<CSSStyleRule>rule)[PropertySymbol.cssText],
								priorityWeight: match.priorityWeight
							});
						}
					}
				}
			} else if (
				rule.type === CSSRuleTypeEnum.mediaRule &&
				// TODO: We need to send in a predefined root font size as it will otherwise be calculated using Window.getComputedStyle(), which will cause a never ending loop. Is there another solution?
				new MediaQueryList({
					window,
					media: (<CSSMediaRule>rule).conditionText,
					rootFontSize: this.element[PropertySymbol.tagName] === 'HTML' ? 16 : null
				}).matches
			) {
				this.parseCSSRules({
					elements: options.elements,
					cssRules: (<CSSMediaRule>rule).cssRules,
					hostElement: options.hostElement,
					scopeElement: options.scopeElement
				});
			} else if (rule.type === CSSRuleTypeEnum.supportsRule) {
				if (window.CSS.supports((<CSSSupportsRule>rule).conditionText)) {
					this.parseCSSRules({
						elements: options.elements,
						cssRules: (<CSSSupportsRule>rule).cssRules,
						hostElement: options.hostElement,
						scopeElement: options.scopeElement
					});
				}
			} else if (rule.type === CSSRuleTypeEnum.containerRule) {
				if (rule instanceof CSSScopeRule) {
					const scopedElements: IStyleAndElement[] = [];
					let scope: IStyleAndElement | null = null;

					for (const element of options.elements) {
						if (scope) {
							if (rule[PropertySymbol.end]) {
								const match = QuerySelector.matches(
									<Element>element.element,
									rule[PropertySymbol.end],
									{
										ignoreErrors: true,
										scope: scope.element
									}
								);
								if (match) {
									break;
								}
							}
							scopedElements.push(element);
						} else {
							const match = QuerySelector.matches(
								<Element>element.element,
								rule[PropertySymbol.start] || ':root',
								{
									ignoreErrors: true
								}
							);
							if (match) {
								scope = element;
								scopedElements.push(element);
							}
						}
					}

					if (scopedElements.length) {
						this.parseCSSRules({
							elements: scopedElements,
							cssRules: (<CSSScopeRule>rule).cssRules,
							hostElement: options.hostElement,
							scopeElement: scope
						});
					}
				}
				// TODO: Add support for CSSContainerRule, which would require element sizes to be measured.
			}
		}
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
		if (
			new WindowBrowserContext(this.element[PropertySymbol.window]).getSettings()
				?.disableComputedStyleRendering
		) {
			return options.value;
		}

		const regexp = new RegExp(CSS_MEASUREMENT_REGEXP);
		let newValue = options.value;
		let match;

		while ((match = regexp.exec(options.value)) !== null) {
			if (match[1] !== 'px') {
				const valueInPixels = CSSMeasurementConverter.toPixels({
					window: this.element[PropertySymbol.window],
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
