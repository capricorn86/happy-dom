import CSSStyleSheet from './CSSStyleSheet.js';
import CSSRuleTypeEnum from './CSSRuleTypeEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import BrowserWindow from '../window/BrowserWindow.js';
import CSSParser from './utilities/CSSParser.js';

/**
 * CSSRule interface.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
 */
export default abstract class CSSRule {
	// Static properties
	public static CONTAINER_RULE = CSSRuleTypeEnum.containerRule;
	public static STYLE_RULE = CSSRuleTypeEnum.styleRule;
	public static IMPORT_RULE = CSSRuleTypeEnum.importRule;
	public static MEDIA_RULE = CSSRuleTypeEnum.mediaRule;
	public static FONT_FACE_RULE = CSSRuleTypeEnum.fontFaceRule;
	public static PAGE_RULE = CSSRuleTypeEnum.pageRule;
	public static KEYFRAMES_RULE = CSSRuleTypeEnum.keyframesRule;
	public static KEYFRAME_RULE = CSSRuleTypeEnum.keyframeRule;
	public static NAMESPACE_RULE = CSSRuleTypeEnum.namespaceRule;
	public static COUNTER_STYLE_RULE = CSSRuleTypeEnum.counterStyleRule;
	public static SUPPORTS_RULE = CSSRuleTypeEnum.supportsRule;
	public static DOCUMENT_RULE = CSSRuleTypeEnum.documentRule;
	public static FONT_FEATURE_VALUES_RULE = CSSRuleTypeEnum.fontFeatureValuesRule;
	public static REGION_STYLE_RULE = CSSRuleTypeEnum.regionStyleRule;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.cssParser]: CSSParser;

	// Public properties
	public [PropertySymbol.parentRule]: CSSRule | null = null;
	public [PropertySymbol.parentStyleSheet]: CSSStyleSheet | null = null;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param cssParser CSS parser.
	 */
	constructor(illegalConstructorSymbol: Symbol, window: BrowserWindow, cssParser: CSSParser) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.window] = window;
		this[PropertySymbol.cssParser] = cssParser;
	}

	/**
	 * Returns parent rule.
	 *
	 * @returns Parent rule.
	 */
	public get parentRule(): CSSRule | null {
		return this[PropertySymbol.parentRule];
	}

	/**
	 * Returns parent style sheet.
	 *
	 * @returns Parent style sheet.
	 */
	public get parentStyleSheet(): CSSStyleSheet | null {
		return this[PropertySymbol.parentStyleSheet];
	}

	/**
	 * Returns type.
	 *
	 * @returns Type.
	 */
	public abstract get type(): CSSRuleTypeEnum;

	/**
	 * Returns CSS text.
	 *
	 * @returns CSS text.
	 */
	public abstract get cssText(): string;
}
