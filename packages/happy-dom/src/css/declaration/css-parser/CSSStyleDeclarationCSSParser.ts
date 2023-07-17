// PropName   => \s*([^:;]+?)\s*:
// PropValue  => \s*((?:[^(;]*?(?:\([^)]*\))?)*?) <- will match any non ';' char except inside (), nested parentheses are not supported
// !important => \s*(!important)?
// EndOfRule  => \s*(?:$|;)
const SPLIT_RULES_REGEXP =
	/\s*([^:;]+?)\s*:\s*((?:[^(;]*?(?:\([^)]*\))?)*?)\s*(!important)?\s*(?:$|;)/g;

/**
 * CSS parser.
 */
export default class CSSStyleDeclarationCSSParser {
	/**
	 * Class construtor.
	 *
	 * @param cssText CSS string.
	 * @param callback Callback.
	 */
	public static parse(
		cssText: string,
		callback: (name: string, value: string, important: boolean) => void
	): void {
		const rules = Array.from(cssText.matchAll(SPLIT_RULES_REGEXP));
		for (const [, key, value, important] of rules) {
			if (key && value) {
				callback(key.trim(), value.trim(), !!important);
			}
		}
	}
}
