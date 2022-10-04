import CSSStyleSheet from './CSSStyleSheet';
import CSSRuleTypeEnum from './CSSRuleTypeEnum';

/**
 * CSSRule interface.
 */
export default class CSSRule {
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

	public parentRule: CSSRule = null;
	public parentStyleSheet: CSSStyleSheet = null;
	public type: number = null;

	/**
	 * Returns selector text.
	 *
	 * @returns Selector text.
	 */
	public get cssText(): string {
		return '';
	}
}
