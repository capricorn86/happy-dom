import ShadowRoot from '../../../nodes/shadow-root/ShadowRoot.js';
import * as PropertySymbol from '../../../PropertySymbol.js';
import Element from '../../../nodes/element/Element.js';
import Document from '../../../nodes/document/Document.js';
import HTMLStyleElement from '../../../nodes/html-style-element/HTMLStyleElement.js';
import NodeList from '../../../nodes/node/NodeList.js';
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
import WindowBrowserContext from '../../../window/WindowBrowserContext.js';
import CSSSupportsRule from '../../rules/CSSSupportsRule.js';
import CSSScopeRule from '../../rules/CSSScopeRule.js';
import CSSStyleSheet from '../../CSSStyleSheet.js';

const CSS_MEASUREMENT_REGEXP = /[0-9.]+(px|rem|em|vw|vh|%|vmin|vmax|cm|mm|in|pt|pc|Q)/g;
const HOST_REGEXP = /:host\s*\(([^)]+)\)|:host-context\s*\(([^)]+)\)/;
const SINGLE_CSS_VARIABLE_REGEXP = /var\( *(--[^), ]+)\)/;
const CSS_VARIABLE_REGEXP = /var\( *(--[^), ]+), *([^), ]+)\)/;

type IStyleAndElement = {
	element: Element | ShadowRoot | Document | null;
	cssTexts: Array<{ cssText: string; priorityWeight: number }>;
};

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationComputedStyle {
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
	public getComputedStyle(): CSSStyleDeclarationPropertyManager {
		const documentElements: Array<IStyleAndElement> = [];
		const parentElements: Array<IStyleAndElement> = [];
		let styleAndElement: IStyleAndElement = {
			element: <Element | ShadowRoot | Document>this.element,
			cssTexts: []
		};
		let shadowRootElements: Array<IStyleAndElement> = [];
		let customElements: IStyleAndElement[] = [];

		if (!this.element[PropertySymbol.isConnected]) {
			return new CSSStyleDeclarationPropertyManager();
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
				if ((<Element>styleAndElement.element).shadowRoot) {
					customElements.push(styleAndElement);
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

				// We need to parse ":host" and ":host-context" rules for custom elements.
				for (const customElement of customElements) {
					const styleSheets = this.getStyleSheets((<Element>customElement.element).shadowRoot);
					for (const styleSheet of styleSheets) {
						this.parseCSSRules({
							elements: [],
							cssRules: styleSheet.cssRules,
							hostElement: customElement
						});
					}
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
						cssRules: styleSheet.cssRules,
						hostElement: styleAndElement
					});
				}

				// We need to parse ":host" and ":host-context" rules for custom elements.
				for (const customElement of customElements) {
					const styleSheets = this.getStyleSheets((<Element>customElement.element).shadowRoot);
					for (const styleSheet of styleSheets) {
						this.parseCSSRules({
							elements: [],
							cssRules: styleSheet.cssRules,
							hostElement: customElement
						});
					}
				}

				customElements = [];
				shadowRootElements = [];
			} else {
				styleAndElement = {
					element: <Element>styleAndElement.element[PropertySymbol.parentNode],
					cssTexts: []
				};
			}
		}

		// Concatenates all parent element CSS to one string.
		const targetElement = parentElements[parentElements.length - 1];
		const propertyManager = new CSSStyleDeclarationPropertyManager();
		const cssProperties: { [k: string]: string } = {};
		let rootFontSize: string | number = 16;
		let parentFontSize: string | number = 16;

		for (const parentElement of parentElements) {
			parentElement.cssTexts.sort((a, b) => a.priorityWeight - b.priorityWeight);

			const defaultCSS = (<any>CSSStyleDeclarationElementDefaultCSS)[
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

			const rulesAndProperties = CSSStyleDeclarationCSSParser.parse(elementCSSText);
			const rules = rulesAndProperties.rules;

			Object.assign(cssProperties, rulesAndProperties.properties);

			for (const { name, value, important } of rules) {
				if (
					(<any>CSSStyleDeclarationElementInheritedProperties)[name] ||
					parentElement === targetElement
				) {
					const parsedValue = this.parseCSSVariablesInValue(value.trim(), cssProperties);

					if (parsedValue && (!propertyManager.get(name)?.important || important)) {
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
					if (selectorText[0] === ':' && selectorText.startsWith(':host')) {
						if (options.hostElement) {
							let isTargetHost = true;

							if (selectorText !== ':host') {
								const selectorMatch = selectorText.match(HOST_REGEXP);
								if (selectorMatch) {
									const match = QuerySelector.matches(
										<Element>options.hostElement.element,
										selectorMatch[1] || selectorMatch[2],
										{
											ignoreErrors: true,
											scope: options.scopeElement?.element
										}
									);
									if (match) {
										const hostContextSelectorText = selectorText?.replace(HOST_REGEXP, '').trim();

										if (hostContextSelectorText && hostContextSelectorText[0] !== ':') {
											isTargetHost = false;

											for (const element of options.elements) {
												const match = QuerySelector.matches(
													<Element>element.element,
													hostContextSelectorText,
													{
														ignoreErrors: true,
														scope: options.scopeElement?.element
													}
												);
												if (match) {
													element.cssTexts.push({
														cssText: (<CSSStyleRule>rule)[PropertySymbol.cssText],
														priorityWeight: 10 + match.priorityWeight
													});
												}
											}
										}
									} else {
										isTargetHost = false;
									}
								}
							}

							if (isTargetHost) {
								options.hostElement.cssTexts.push({
									cssText: (<CSSStyleRule>rule)[PropertySymbol.cssText],
									priorityWeight: 10
								});
							}
						}
					} else {
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
	 * Parses CSS variables in a value.
	 *
	 * @param value Value.
	 * @param cssVariables CSS variables.
	 * @returns CSS value.
	 */
	private parseCSSVariablesInValue(value: string, cssVariables: { [k: string]: string }): string {
		let newValue = value;
		let match: RegExpMatchArray | null;

		while ((match = newValue.match(SINGLE_CSS_VARIABLE_REGEXP)) != null) {
			// Without fallback value - E.g. var(--my-var)
			newValue = newValue.replace(match[0], cssVariables[match[1]] || '');
		}

		while ((match = newValue.match(CSS_VARIABLE_REGEXP)) !== null) {
			// Fallback value - E.g. var(--my-var, #FFFFFF)
			newValue = newValue.replace(match[0], cssVariables[match[1]] || match[2]);
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
