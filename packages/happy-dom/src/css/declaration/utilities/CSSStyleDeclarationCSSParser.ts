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
		const parts = cssText.split(';');

		for (const part of parts) {
			if (part) {
				const [name, value]: string[] = part.trim().split(':');
				if (value) {
					const trimmedName = name.trim();
					const trimmedValue = value.trim();
					if (trimmedName && trimmedValue) {
						const important = trimmedValue.endsWith(' !important');
						const valueWithoutImportant = trimmedValue.replace(' !important', '');

						if (valueWithoutImportant) {
							callback(trimmedName, valueWithoutImportant, important);
						}
					}
				}
			}
		}
	}
}
