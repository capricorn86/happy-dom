import CSSStyleSheet from './CSSStyleSheet';

/**
 * CSSRule interface.
 */
export default class CSSRule {
	public static STYLE_RULE = 1;
	public static IMPORT_RULE = 3;
	public static MEDIA_RULE = 4;
	public static FONT_FACE_RULE = 5;
	public static PAGE_RULE = 6;
	public static KEYFRAMES_RULE = 7;
	public static KEYFRAME_RULE = 8;
	public static NAMESPACE_RULE = 10;
	public static COUNTER_STYLE_RULE = 11;
	public static SUPPORTS_RULE = 12;
	public static DOCUMENT_RULE = 13;
	public static FONT_FEATURE_VALUES_RULE = 14;
	public static REGION_STYLE_RULE = 16;

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
