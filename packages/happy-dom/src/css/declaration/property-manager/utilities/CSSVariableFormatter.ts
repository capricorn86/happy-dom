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
		return this.substitute(value, (name) =>
			cssVariables[name] ? this.resolveVariables(cssVariables[name], cssVariables) : undefined
		);
	}

	/**
	 * Computes the custom properties declared on an element.
	 *
	 * The var() references in a custom property are substituted on the element that declares it, against the custom properties of that same element. Those are either declared on it too, or inherited, in which case they were already computed on an ancestor. Custom properties that are part of a reference cycle are invalid, which is represented by an empty string.
	 *
	 * @see https://www.w3.org/TR/css-variables-1/#cycles
	 * @param declared Custom properties declared on the element, with var() references not yet substituted.
	 * @param inherited Computed custom properties inherited from the parent element.
	 * @returns Computed values of the declared custom properties.
	 */
	public static resolveCustomProperties(
		declared: { [k: string]: string },
		inherited: { [k: string]: string }
	): { [k: string]: string } {
		const computed: { [k: string]: string } = {};
		const stack: string[] = [];
		const cyclic = new Set<string>();
		const compute = (name: string): string | undefined => {
			if (!(name in declared)) {
				return inherited[name] || undefined;
			}
			if (name in computed) {
				return computed[name] || undefined;
			}
			const index = stack.indexOf(name);
			if (index !== -1) {
				for (let i = index; i < stack.length; i++) {
					cyclic.add(stack[i]);
				}
				return undefined;
			}
			stack.push(name);
			const value = this.substitute(declared[name], compute);
			stack.pop();
			computed[name] = cyclic.has(name) ? '' : value;
			return computed[name] || undefined;
		};

		for (const name of Object.keys(declared)) {
			compute(name);
		}

		return computed;
	}

	/**
	 * Substitutes the var() references in a value.
	 *
	 * @param value Value containing CSS variable.
	 * @param getVariable Returns the value to substitute for a variable, or undefined to use the fallback value.
	 * @returns Parsed value.
	 */
	private static substitute(
		value: string,
		getVariable: (name: string) => string | undefined
	): string {
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
				const variableValue = getVariable(variable.name);
				const substitution =
					variableValue !== undefined
						? variableValue
						: this.substitute(
								value.substring(variable.fallbackIndex, match.index).trim(),
								getVariable
							);
				// The rest of the value may hold further var() references (e.g. "calc(var(--a) + var(--b))").
				return `${value.substring(0, variable.index)}${substitution}${this.substitute(value.substring(match.index! + match[0].length), getVariable)}`;
			}
		}

		return value;
	}
}
