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
		const rules = [
			...cssText.matchAll(
				// PropName   => \s*([^:;]+?)\s*:
				// PropValue  => \s*((?:[^(;]*?(?:\([^)]*\))?)*?) <- will match any non ';' char except inside (), nested parentheses are not supported
				// !important => \s*(!important)?
				// EndOfRule  => \s*(?:$|;)
				/\s*([^:;]+?)\s*:\s*((?:[^(;]*?(?:\([^)]*\))?)*?)\s*(!important)?\s*(?:$|;)/g
			)
		];
		rules.forEach(([, key, value, important]) => {
			if (key && value) {
				callback(key.trim(), value.trim(), !!important);
			}
		});
	}
}
