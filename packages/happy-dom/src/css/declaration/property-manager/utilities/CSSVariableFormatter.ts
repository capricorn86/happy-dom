const SIMPLE_VARIABLE_REGEXP = /^var\(\s*(--[a-zA-Z0-9-_]+)\)$/;
const FALLBACK_VARIABLE_REGEXP = /^var\(\s*(--[a-zA-Z0-9-_]+),\s*([^)]+)([)\s]+)$/;
const SPACE_REGEXP = /\s/g;

/**
 * CSS variable formatter.
 */
export default class CSSVariableFormatter {
	/**
	 * Formats CSS variable.
	 *
	 * @param value Value containing CSS variable.
	 * @returns Parsed value.
	 */
	public static getVariable(value: string): string | null {
		const simpleVariableMatch = value.match(SIMPLE_VARIABLE_REGEXP);

		if (simpleVariableMatch) {
			return `var(${simpleVariableMatch[1]})`;
		}

		const variableMatch = value.match(FALLBACK_VARIABLE_REGEXP);

		if (variableMatch) {
			const fallbackValue = variableMatch[2].trim();
			const parentheses = variableMatch[3].replace(SPACE_REGEXP, '').slice(1);
			return `var(${variableMatch[1]}, ${this.getVariable(fallbackValue + parentheses) || fallbackValue})`;
		}

		return null;
	}

	/**
	 * Resolves CSS variables into it's value.
	 *
	 * @param value Value containing CSS variable.
	 * @param cssVariables CSS variables.
	 * @returns Parsed value.
	 */
	public static resolveVariables(value: string, cssVariables: { [k: string]: string }): string {
		let newValue = value;
		let match: RegExpMatchArray | null;

		// Without fallback value - E.g. var(--my-var)
		while ((match = newValue.match(SIMPLE_VARIABLE_REGEXP)) != null) {
			newValue = newValue.replace(match[0], cssVariables[match[1]] || '');
		}

		// Fallback value - E.g. var(--my-var, #FFFFFF)
		while ((match = newValue.match(FALLBACK_VARIABLE_REGEXP)) !== null) {
			const parentheses = match[3].replace(SPACE_REGEXP, '').slice(1);
			newValue = newValue.replace(match[0], (cssVariables[match[1]] || match[2]) + parentheses);
		}

		return newValue;
	}
}
