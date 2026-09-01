const GET_SIMPLE_VARIABLE_REGEXP = /^var\(\s*(--[a-zA-Z0-9-_]+)\s*\)$/;
const GET_FALLBACK_VARIABLE_REGEXP = /^var\(\s*(--[a-zA-Z0-9-_]+),\s*(.+)\)$/;
const RESOLVE_REGEXP = /var\(\s*(--[a-zA-Z0-9-_]+),?|(\()|(\))/;

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
		const simpleVariableMatch = value.match(GET_SIMPLE_VARIABLE_REGEXP);

		if (simpleVariableMatch) {
			return `var(${simpleVariableMatch[1]})`;
		}

		const variableMatch = value.match(GET_FALLBACK_VARIABLE_REGEXP);

		if (variableMatch) {
			const fallbackValue = variableMatch[2].trim();
			return `var(${variableMatch[1]}, ${this.getVariable(fallbackValue) || fallbackValue})`;
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
		const regexp = new RegExp(RESOLVE_REGEXP, 'g');
		let match: RegExpMatchArray | null;
		let variable: {
			parentheses: number;
			name: string;
			index: number;
			fallbackIndex: number;
		} | null = null;
		let parentheses = 0;

		while ((match = regexp.exec(value)) != null) {
			if (match[1] && !variable) {
				variable = {
					parentheses,
					name: match[1],
					index: match.index!,
					fallbackIndex: match.index! + match[0].length
				};
			}

			if (match[1] || match[2]) {
				parentheses++;
			} else if (match[3]) {
				parentheses--;
			}

			if (variable && variable.parentheses === parentheses) {
				const fallbackValue = value.substring(variable.fallbackIndex, match.index).trim();
				const variableValue = cssVariables[variable.name];
				return `${value.substring(0, variable.index)}${this.resolveVariables(variableValue || fallbackValue, cssVariables)}${value.substring(match.index! + match[0].length)}`;
			}
		}

		return value;
	}
}
