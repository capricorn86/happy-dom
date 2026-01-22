import * as csstree from 'css-tree';
import CSSRule from '../CSSRule.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import CSSStyleSheet from '../CSSStyleSheet.js';
import CSSStyleRule from '../rules/CSSStyleRule.js';
import CSSKeyframeRule from '../rules/CSSKeyframeRule.js';
import CSSKeyframesRule from '../rules/CSSKeyframesRule.js';
import CSSMediaRule from '../rules/CSSMediaRule.js';
import CSSContainerRule from '../rules/CSSContainerRule.js';
import CSSSupportsRule from '../rules/CSSSupportsRule.js';
import CSSFontFaceRule from '../rules/CSSFontFaceRule.js';
import CSSScopeRule from '../rules/CSSScopeRule.js';
import CSSLayerBlockRule from '../rules/CSSLayerBlockRule.js';
import CSSLayerStatementRule from '../rules/CSSLayerStatementRule.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import SelectorParser from '../../query-selector/SelectorParser.js';

// Regex to add space after colon in CSS conditions (e.g., "min-width:36rem" -> "min-width: 36rem")
const COLON_SPACE_REGEXP = /:(?=[^\s])/g;

/**
 * CSS parser using css-tree.
 */
export default class CSSParser {
	#parentStyleSheet: CSSStyleSheet;

	/**
	 * Constructor.
	 *
	 * @param parentStyleSheet Parent style sheet.
	 */
	constructor(parentStyleSheet: CSSStyleSheet) {
		this.#parentStyleSheet = parentStyleSheet;
	}

	/**
	 * Parses CSS text and returns CSS rules.
	 *
	 * @param cssText CSS code.
	 * @returns CSS rules.
	 */
	public parseFromString(cssText: string): CSSRule[] {
		const ast = <csstree.StyleSheet>csstree.parse(cssText, {
			parseAtrulePrelude: true,
			parseRulePrelude: true,
			parseValue: false,
			parseCustomProperty: false
		});

		return this.convertStyleSheet(ast);
	}

	/**
	 * Converts a css-tree StyleSheet AST to CSSOM rules.
	 *
	 * @param ast StyleSheet AST node.
	 * @returns Array of CSSRule objects.
	 */
	private convertStyleSheet(ast: csstree.StyleSheet): CSSRule[] {
		const rules: CSSRule[] = [];

		if (ast.children) {
			for (const node of ast.children) {
				const rule = this.convertNode(node);
				if (rule) {
					rules.push(rule);
				}
			}
		}

		return rules;
	}

	/**
	 * Converts a css-tree AST node to a CSSOM rule.
	 *
	 * @param node AST node.
	 * @param parentRule Optional parent rule.
	 * @returns CSSRule or null.
	 */
	private convertNode(node: csstree.CssNode, parentRule?: CSSRule): CSSRule | null {
		const window = this.#parentStyleSheet[PropertySymbol.window];

		switch (node.type) {
			case 'Rule':
				return this.convertStyleRule(node, window, parentRule);
			case 'Atrule':
				return this.convertAtRule(node, window, parentRule);
			default:
				return null;
		}
	}

	/**
	 * Converts a css-tree Rule node to CSSStyleRule.
	 *
	 * @param node Rule AST node.
	 * @param window Browser window.
	 * @param parentRule Optional parent rule.
	 * @returns CSSStyleRule or null if selector is invalid.
	 */
	private convertStyleRule(
		node: csstree.Rule,
		window: BrowserWindow,
		parentRule?: CSSRule
	): CSSStyleRule | null {
		// Get selector text
		let selectorText = '';
		if (node.prelude) {
			selectorText = csstree.generate(node.prelude);
		}

		// Validate selector
		if (!this.validateSelectorText(selectorText)) {
			return null;
		}

		const rule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;
		rule[PropertySymbol.selectorText] = selectorText;

		// Get declarations as CSS text
		if (node.block) {
			rule[PropertySymbol.cssText] = this.extractDeclarations(node.block);
		}

		return rule;
	}

	/**
	 * Converts a css-tree Atrule node to the appropriate CSSOM rule.
	 *
	 * @param node Atrule AST node.
	 * @param window Browser window.
	 * @param parentRule Optional parent rule.
	 * @returns CSSRule or null.
	 */
	private convertAtRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		parentRule?: CSSRule
	): CSSRule | null {
		const atRuleName = node.name.toLowerCase();
		const isWebkitPrefixed = atRuleName.startsWith('-webkit-');
		const normalizedName = isWebkitPrefixed ? atRuleName.slice(8) : atRuleName;

		switch (normalizedName) {
			case 'media':
				return this.convertMediaRule(node, window, isWebkitPrefixed, parentRule);
			case 'keyframes':
				return this.convertKeyframesRule(node, window, isWebkitPrefixed, parentRule);
			case 'supports':
				return this.convertSupportsRule(node, window, isWebkitPrefixed, parentRule);
			case 'container':
				return this.convertContainerRule(node, window, isWebkitPrefixed, parentRule);
			case 'font-face':
				return this.convertFontFaceRule(node, window, parentRule);
			case 'scope':
				return this.convertScopeRule(node, window, isWebkitPrefixed, parentRule);
			case 'layer':
				return this.convertLayerRule(node, window, parentRule);
			default:
				// Unknown at-rule - skip it
				return null;
		}
	}

	/**
	 * Converts a @media rule.
	 * @param node
	 * @param window
	 * @param _isWebkitPrefixed
	 * @param parentRule
	 */
	private convertMediaRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		_isWebkitPrefixed: boolean,
		parentRule?: CSSRule
	): CSSMediaRule {
		const rule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;

		// Parse media query list
		if (node.prelude) {
			const mediaText = this.normalizeConditionText(csstree.generate(node.prelude));
			const mediums = mediaText.split(',');
			for (const medium of mediums) {
				rule.media.appendMedium(medium.trim());
			}
		}

		// Parse nested rules
		if (node.block) {
			this.parseNestedRules(node.block, rule);
		}

		return rule;
	}

	/**
	 * Converts a @keyframes rule.
	 * @param node
	 * @param window
	 * @param isWebkitPrefixed
	 * @param parentRule
	 */
	private convertKeyframesRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		isWebkitPrefixed: boolean,
		parentRule?: CSSRule
	): CSSKeyframesRule {
		const rule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;
		rule[PropertySymbol.rulePrefix] = isWebkitPrefixed ? '-webkit-' : '';

		// Get keyframes name
		if (node.prelude) {
			rule[PropertySymbol.name] = csstree.generate(node.prelude).trim();
		}

		// Parse keyframe rules
		if (node.block && node.block.children) {
			for (const child of node.block.children) {
				if (child.type === 'Rule') {
					const keyframeRule = this.convertKeyframeRule(child, window, rule);
					if (keyframeRule) {
						rule[PropertySymbol.cssRules].push(keyframeRule);
					}
				}
			}
		}

		return rule;
	}

	/**
	 * Converts a keyframe rule (e.g., "from", "to", "50%").
	 * @param node
	 * @param window
	 * @param parentRule
	 */
	private convertKeyframeRule(
		node: csstree.Rule,
		window: BrowserWindow,
		parentRule: CSSKeyframesRule
	): CSSKeyframeRule {
		const rule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule;

		// Get key text (from, to, percentage)
		if (node.prelude) {
			let keyText = csstree.generate(node.prelude).trim();
			if (keyText === 'from') {
				keyText = '0%';
			} else if (keyText === 'to') {
				keyText = '100%';
			}
			rule[PropertySymbol.keyText] = keyText;
		}

		// Get declarations
		if (node.block) {
			rule[PropertySymbol.cssText] = this.extractDeclarations(node.block);
		}

		return rule;
	}

	/**
	 * Converts a @supports rule.
	 * @param node
	 * @param window
	 * @param isWebkitPrefixed
	 * @param parentRule
	 */
	private convertSupportsRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		isWebkitPrefixed: boolean,
		parentRule?: CSSRule
	): CSSSupportsRule {
		const rule = new CSSSupportsRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;
		rule[PropertySymbol.rulePrefix] = isWebkitPrefixed ? '-webkit-' : '';

		// Get condition text
		if (node.prelude) {
			rule[PropertySymbol.conditionText] = this.normalizeConditionText(
				csstree.generate(node.prelude)
			);
		}

		// Parse nested rules
		if (node.block) {
			this.parseNestedRules(node.block, rule);
		}

		return rule;
	}

	/**
	 * Converts a @container rule.
	 * @param node
	 * @param window
	 * @param isWebkitPrefixed
	 * @param parentRule
	 */
	private convertContainerRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		isWebkitPrefixed: boolean,
		parentRule?: CSSRule
	): CSSContainerRule {
		const rule = new CSSContainerRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;
		rule[PropertySymbol.rulePrefix] = isWebkitPrefixed ? '-webkit-' : '';

		// Get condition text
		if (node.prelude) {
			rule[PropertySymbol.conditionText] = this.normalizeConditionText(
				csstree.generate(node.prelude)
			);
		}

		// Parse nested rules
		if (node.block) {
			this.parseNestedRules(node.block, rule);
		}

		return rule;
	}

	/**
	 * Converts a @font-face rule.
	 * @param node
	 * @param window
	 * @param parentRule
	 */
	private convertFontFaceRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		parentRule?: CSSRule
	): CSSFontFaceRule {
		const rule = new CSSFontFaceRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;

		// Get declarations
		if (node.block) {
			rule[PropertySymbol.cssText] = this.extractDeclarations(node.block);
		}

		return rule;
	}

	/**
	 * Converts a @scope rule.
	 * @param node
	 * @param window
	 * @param isWebkitPrefixed
	 * @param parentRule
	 */
	private convertScopeRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		isWebkitPrefixed: boolean,
		parentRule?: CSSRule
	): CSSScopeRule {
		const rule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, this);

		rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
		rule[PropertySymbol.parentRule] = parentRule || null;
		rule[PropertySymbol.rulePrefix] = isWebkitPrefixed ? '-webkit-' : '';

		// Parse scope prelude: @scope (start) to (end)
		if (node.prelude) {
			const preludeText = csstree.generate(node.prelude);
			const scopeParts = preludeText.split(/\s+to\s+/i);

			if (scopeParts[0]) {
				const startMatch = scopeParts[0].trim();
				if (startMatch.startsWith('(') && startMatch.endsWith(')')) {
					rule[PropertySymbol.start] = startMatch.slice(1, -1);
				}
			}

			if (scopeParts[1]) {
				const endMatch = scopeParts[1].trim();
				if (endMatch.startsWith('(') && endMatch.endsWith(')')) {
					rule[PropertySymbol.end] = endMatch.slice(1, -1);
				}
			}
		}

		// Parse nested rules
		if (node.block) {
			this.parseNestedRules(node.block, rule);
		}

		return rule;
	}

	/**
	 * Converts a @layer rule (block or statement).
	 * @param node
	 * @param window
	 * @param parentRule
	 */
	private convertLayerRule(
		node: csstree.Atrule,
		window: BrowserWindow,
		parentRule?: CSSRule
	): CSSLayerBlockRule | CSSLayerStatementRule {
		// If there's a block, it's a layer block rule
		if (node.block) {
			const rule = new CSSLayerBlockRule(PropertySymbol.illegalConstructor, window, this);

			rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
			rule[PropertySymbol.parentRule] = parentRule || null;

			// Get layer name from prelude
			if (node.prelude) {
				rule[PropertySymbol.name] = this.extractLayerName(node.prelude);
			}

			// Parse nested rules
			this.parseNestedRules(node.block, rule);

			return rule;
		} else {
			// No block means it's a layer statement rule
			const rule = new CSSLayerStatementRule(PropertySymbol.illegalConstructor, window, this);

			rule[PropertySymbol.parentStyleSheet] = this.#parentStyleSheet;
			rule[PropertySymbol.parentRule] = parentRule || null;

			// Get layer names from prelude
			if (node.prelude) {
				rule[PropertySymbol.nameList] = this.extractLayerNames(node.prelude);
			}

			return rule;
		}
	}

	/**
	 * Extracts a single layer name from a prelude.
	 * @param prelude
	 */
	private extractLayerName(prelude: csstree.AtrulePrelude | csstree.Raw): string {
		if (prelude.type === 'Raw') {
			return prelude.value.trim();
		}

		// Look for Layer or LayerList nodes
		let name = '';
		csstree.walk(prelude, (node: csstree.CssNode) => {
			if (!name && node.type === 'Identifier' && 'name' in node) {
				name = node.name;
			}
		});

		if (!name) {
			// Fallback to generating the prelude text
			name = csstree.generate(prelude).trim();
		}

		return name;
	}

	/**
	 * Extracts layer names from a prelude (for layer statement rules).
	 * @param prelude
	 */
	private extractLayerNames(prelude: csstree.AtrulePrelude | csstree.Raw): string[] {
		if (prelude.type === 'Raw') {
			return prelude.value.split(',').map((n: string) => n.trim());
		}

		const names: string[] = [];
		csstree.walk(prelude, (node: csstree.CssNode) => {
			if (node.type === 'Identifier' && 'name' in node) {
				names.push(node.name);
			}
		});

		if (names.length === 0) {
			// Fallback to parsing the generated text
			const text = csstree.generate(prelude);
			return text.split(',').map((n: string) => n.trim());
		}

		return names;
	}

	/**
	 * Parses nested rules from a block into a parent grouping rule.
	 * @param block
	 * @param parentRule
	 */
	private parseNestedRules(block: csstree.Block, parentRule: CSSRule): void {
		if (!block.children) {
			return;
		}

		const cssRules = (<{ [PropertySymbol.cssRules]: CSSRule[] }>(<unknown>parentRule))[
			PropertySymbol.cssRules
		];

		for (const child of block.children) {
			const rule = this.convertNode(child, parentRule);
			if (rule) {
				cssRules.push(rule);
			}
		}
	}

	/**
	 * Extracts declarations from a block as CSS text.
	 * @param block
	 */
	private extractDeclarations(block: csstree.Block): string {
		const declarations: string[] = [];

		if (block.children) {
			for (const child of block.children) {
				if (child.type === 'Declaration') {
					const value = csstree.generate(child.value);
					const important = child.important ? ' !important' : '';
					declarations.push(`${child.property}: ${value}${important}`);
				}
			}
		}

		return declarations.join('; ') + (declarations.length ? ';' : '');
	}

	/**
	 * Normalizes condition text by adding spaces after colons.
	 * css-tree generates "min-width:36rem" but browsers use "min-width: 36rem".
	 *
	 * @param text Condition text.
	 * @returns Normalized condition text.
	 */
	private normalizeConditionText(text: string): string {
		return text.replace(COLON_SPACE_REGEXP, ': ');
	}

	/**
	 * Validates a selector text.
	 *
	 * @see https://www.w3.org/TR/CSS21/syndata.html#rule-sets
	 * @param selectorText Selector text.
	 * @returns True if valid, false otherwise.
	 */
	private validateSelectorText(selectorText: string): boolean {
		try {
			SelectorParser.getSelectorGroups(selectorText);
		} catch (e) {
			return false;
		}
		return true;
	}
}
