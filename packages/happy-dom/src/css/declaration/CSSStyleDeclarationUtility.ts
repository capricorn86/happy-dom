/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationUtility {
	/**
	 * Converts style string to object.
	 *
	 * @param styleString Style string (e.g. "border: 2px solid red; font-size: 12px;").
	 * @param [cache] Cache.
	 * @returns Style object.
	 */
	public static styleStringToObject(styleString: string): { [k: string]: string } {
		const styles = {};

		if (styleString) {
			const parts = styleString.split(';');

			for (const part of parts) {
				if (part) {
					const [name, value]: string[] = part.trim().split(':');
					if (value) {
						const trimmedName = name.trim();
						const trimmedValue = value.trim();
						if (trimmedName && trimmedValue) {
							styles[trimmedName] = trimmedValue;
						}
					}
				}
			}
		}

		return styles;
	}

	/**
	 * Converts style object to string.
	 *
	 * @param styleObject Style object.
	 * @returns Styles as string.
	 */
	public static styleObjectToString(styleObject: { [k: string]: string }): string {
		const keys = Object.keys(styleObject);
		let styleString = '';

		for (const key of keys) {
			if (styleString) {
				styleString += ' ';
			}
			styleString += `${key}: ${styleObject[key]};`;
		}

		return styleString;
	}
}
