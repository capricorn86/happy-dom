import BrowserWindow from '../../../window/BrowserWindow.js';

/**
 * Code regexp.
 *
 * Group 1: Import without exported properties.
 * Group 2: Dynamic import function call.
 * Group 3: Import exported variables.
 * Group 4: Import exported url.
 * Group 5: Import with group.
 * Group 6: Import with type.
 * Group 7: Modules in export from module statement.
 * Group 8: Import in export from module statement.
 * Group 9: Export default statement.
 * Group 10: Export function or class type.
 * Group 11: Export function or class name.
 * Group 12: Export object.
 * Group 13: Export variable type (var, let or const).
 * Group 14: Export variable name.
 * Group 15: Export variable name end character (= or ;).
 * Group 16: Single line comment.
 * Group 17: Multi line comment.
 * Group 18: Slash (RegExp).
 * Group 19: Parentheses.
 * Group 20: Curly braces.
 * Group 21: Square brackets.
 * Group 22: String apostrophe (', " or `).
 */
const CODE_REGEXP =
	/import\s["']([^"']+)["'];{0,1}|import\s*\(([^)]+)\)|(import\s+)|\sfrom\s["']([^"']+)["'](\s+with\s*{\s*type\s*:\s*["']([^"']+)["']\s*}){0,1}|export\s([a-zA-Z0-9-_$]+|\*|\*\s+as\s+["'a-zA-Z0-9-_$]+|{[^}]+})\sfrom\s["']([^"']+)["']|(export\sdefault\s)|export\s(function\*{0,1}|class)\s([^({\s]+)|export\s{([^}]+)}|export\s(var|let|const)\s+([^=;]+)(=|;)|(\/\/.*$)|(\/\*|\*\/)|(\/)|(\(|\))|({|})|(\[|\])|('|"|`)/gm;

/**
 * Import regexp.
 *
 * Group 1: Import braces.
 * Group 2: Import all as.
 * Group 3: Import default.
 */
const IMPORT_REGEXP = /{([^}]+)}|\*\s+as\s+([a-zA-Z0-9-_$]+)|([a-zA-Z0-9-_$]+)/gm;

/**
 * Valid preceding token before a statement regexp.
 */
const PRECEDING_STATEMENT_TOKEN_REGEXP = /['"`(){}\s;]/;

/**
 * Multiline comment regexp.
 */
const MULTILINE_COMMENT_REGEXP = /\/\*|\*\//gm;

interface IModuleImport {
	url: string;
	type: string;
}

/**
 * Module parser.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/export
 */
export default class EcmaScriptModuleParser {
	public readonly window: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param url Module URL.
	 */
	constructor(window: BrowserWindow) {
		this.window = window;
	}

	/**
	 * Parse a module.
	 *
	 * @param moduleURL Module URL.
	 * @param code Code.
	 * @returns Result.
	 */
	public parse(moduleURL: string, code: string): { imports: IModuleImport[]; code: string } {
		const regExp = new RegExp(CODE_REGEXP);
		const imports: IModuleImport[] = [];
		const count = {
			comment: 0,
			parantheses: 0,
			curlyBraces: 0,
			squareBrackets: 0,
			regExp: 0
		};
		const exportSpreadVariables: Array<Map<string, string>> = [];
		let newCode = `//# sourceURL=${moduleURL}\n`;
		let match: RegExpExecArray;
		let precedingToken: string;
		let stringCharacter: string | null = null;
		let lastIndex = 0;
		let importStartIndex = -1;
		let skipMatchedCode = false;

		while ((match = regExp.exec(code))) {
			if (importStartIndex === -1) {
				newCode += code.substring(lastIndex, match.index);
			}
			precedingToken = code[match.index - 1] || ' ';

			// Imports and exports are only valid outside any statement, string or comment at the top level
			if (
				count.comment === 0 &&
				count.parantheses === 0 &&
				count.curlyBraces === 0 &&
				count.squareBrackets === 0 &&
				count.regExp === 0 &&
				!stringCharacter
			) {
				if (match[1] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Import without exported properties
					imports.push({ url: new URL(match[1], moduleURL).href, type: 'ecmascript' });
					skipMatchedCode = true;
				} else if (match[3] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Import statement start
					if (importStartIndex !== -1) {
						throw new this.window.TypeError(
							`Failed to parse module: Unexpected import statement in "${moduleURL}"`
						);
					}
					importStartIndex = match.index + match[0].length;
					skipMatchedCode = true;
				} else if (match[4]) {
					// Import statement end
					if (importStartIndex !== -1) {
						const url = new URL(match[4], moduleURL).href;
						const variables = code.substring(importStartIndex, match.index);
						const importRegExp = new RegExp(IMPORT_REGEXP);
						const importCode: string[] = [];
						let importMatch: RegExpExecArray;
						while ((importMatch = importRegExp.exec(variables))) {
							if (importMatch[1]) {
								// Import braces
								importCode.push(
									`const {${importMatch[1].replace(
										/\s+as\s+/gm,
										': '
									)}} = $happy_dom.imports.get('${url}')`
								);
							} else if (importMatch[2]) {
								// Import all as
								importCode.push(`const ${importMatch[2]} = $happy_dom.imports.get('${url}')`);
							} else if (importMatch[3]) {
								// Import default
								importCode.push(
									`const ${importMatch[3]} = $happy_dom.imports.get('${url}').default`
								);
							}
						}
						newCode += importCode.join(';\n');
						importStartIndex = -1;
						imports.push({ url, type: match[6] || 'ecmascript' });
						skipMatchedCode = true;
					}
				} else if (match[7] && match[8] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export from module statement

					const url = new URL(match[8], moduleURL).href;
					const imported = match[7];

					if (imported === '*') {
						newCode += `Object.assign($happy_dom.exports, $happy_dom.imports.get('${url}'))`;
						imports.push({ url, type: 'ecmascript' });
					} else if (imported[0] === '*') {
						const parts = imported.split(/\s+as\s+/);
						if (parts.length === 2) {
							const exportName = parts[1].replace(/["']/g, '');
							newCode += `$happy_dom.exports['${exportName}'] = $happy_dom.imports.get('${url}')`;
							imports.push({ url, type: 'ecmascript' });
						}
					} else if (imported[0] === '{') {
						const parts = this.removeMultilineComments(imported)
							.slice(1, -1)
							.split(/\s*,\s*/);
						const exportCode: string[] = [];
						for (const part of parts) {
							const nameParts = part.trim().split(/\s+as\s+/);
							const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
							const importName = nameParts[0].replace(/["']/g, '');
							if (exportName && importName) {
								exportCode.push(
									`$happy_dom.exports['${exportName}'] = $happy_dom.imports.get('${url}')['${importName}']`
								);
							}
						}
						newCode += exportCode.join(';\n');
						imports.push({ url, type: 'ecmascript' });
					}
					skipMatchedCode = true;
				} else if (match[9] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export default statement
					newCode += '$happy_dom.exports.default = ';
					skipMatchedCode = true;
				} else if (
					match[10] &&
					match[11] &&
					PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
				) {
					// Export function or class type
					newCode += `$happy_dom.exports['${match[11]}'] = ${match[10]} ${match[11]}`;
					skipMatchedCode = true;
				} else if (match[12] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export object
					const parts = this.removeMultilineComments(match[12]).split(/\s*,\s*/);
					const exportCode: string[] = [];
					for (const part of parts) {
						const nameParts = part.trim().split(/\s+as\s+/);
						const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
						const importName = nameParts[0].replace(/["']/g, '');
						if (exportName && importName) {
							exportCode.push(`$happy_dom.exports['${exportName}'] = ${importName}`);
						}
					}
					newCode += exportCode.join(';\n');
					skipMatchedCode = true;
				} else if (match[13] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export variable
					if (match[15] === '=') {
						const exportName = this.removeMultilineComments(match[14]).trim();
						if (
							(exportName[0] === '{' && exportName[exportName.length - 1] === '}') ||
							(exportName[0] === '[' && exportName[exportName.length - 1] === ']')
						) {
							const parts = exportName.slice(1, -1).split(/\s*,\s*/);
							const variableObject: Map<string, string> = new Map();

							for (const part of parts) {
								const nameParts = part.trim().split(/\s*:\s*/);
								const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
								const importName = nameParts[0].replace(/["']/g, '');
								if (exportName && importName) {
									variableObject.set(exportName, importName);
								}
							}

							newCode += `const $happy_dom_export_${exportSpreadVariables.length} =`;
							exportSpreadVariables.push(variableObject);
						} else {
							newCode += `$happy_dom.exports['${exportName}'] =`;
						}
					} else {
						// TODO: If there is no =, we should ignore until we know what is is useful for
						// Example: export let name1, name2, name3;
						newCode += `/*Unknown export: ${match[0]}*/`;
						this.window.console.warn(`Unknown export in "${moduleURL}": ${match[0]}`);
					}
					skipMatchedCode = true;
				}
			}

			if (stringCharacter === null && count.comment === 0 && count.regExp === 0) {
				if (
					match[2] &&
					count.comment === 0 &&
					count.regExp === 0 &&
					PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
				) {
					// Dynamic import function call
					newCode += `$happy_dom.dynamicImport(${match[2]})`;
					skipMatchedCode = true;
				} else if (match[19] && count.regExp === 0 && count.comment === 0) {
					// Parentheses
					if (match[19] === '(') {
						count.parantheses++;
					}
					if (match[19] === ')' && count.parantheses > 0) {
						count.parantheses--;
					}
				} else if (match[20] && count.regExp === 0 && count.comment === 0) {
					// Curly braces
					if (match[20] === '{') {
						count.curlyBraces++;
					}
					if (match[20] === '}' && count.curlyBraces > 0) {
						count.curlyBraces--;
					}
				} else if (match[21] && count.regExp === 0 && count.comment === 0) {
					// Square brackets
					if (match[21] === '[') {
						count.squareBrackets++;
					}
					if (match[21] === ']' && count.squareBrackets > 0) {
						count.squareBrackets--;
					}
				}
			} else if (stringCharacter === null && count.comment === 0) {
				if (match[18]) {
					// Slash (RegExp)
					if (precedingToken !== '\\') {
						count.regExp = count.regExp === 0 ? 1 : 0;
					}
				}
			} else if (stringCharacter === null && count.regExp === 0) {
				if (match[16]) {
					// Ignore single line comment
				} else if (match[17]) {
					// Multi line comment
					if (match[17] === '/*') {
						count.comment++;
					} else if (match[17] === '*/' && count.comment > 0) {
						count.comment--;
					}
				}
			} else if (match[22] && count.regExp === 0) {
				// String
				if (precedingToken !== '\\') {
					if (stringCharacter === null) {
						stringCharacter = match[22];
					} else if (stringCharacter === match[22]) {
						stringCharacter = null;
					}
				}
			}

			// Unless the code has been handled by transforming imports or exports, we add it to the new code
			if (!skipMatchedCode && importStartIndex === -1) {
				newCode += match[0];
			}

			skipMatchedCode = false;
			lastIndex = regExp.lastIndex;
		}

		if (importStartIndex !== -1) {
			throw new this.window.TypeError(
				`Failed to parse module: Unexpected import statement in "${moduleURL}"`
			);
		}

		newCode += code.substring(lastIndex);

		if (exportSpreadVariables.length > 0) {
			newCode += '\n\n';

			for (let i = 0; i < exportSpreadVariables.length; i++) {
				for (const [exportName, importName] of exportSpreadVariables[i]) {
					newCode += `$happy_dom.exports['${exportName}'] = $happy_dom_export_${i}['${importName}'];\n`;
				}
			}
		}

		return { imports, code: newCode };
	}

	/**
	 * Remove multiline comments.
	 *
	 * @param code Code.
	 * @returns Code without multiline comments.
	 */
	private removeMultilineComments(code: string): string {
		const regexp = new RegExp(MULTILINE_COMMENT_REGEXP);
		let match: RegExpExecArray;
		let count = 0;
		let lastIndex = 0;
		let newCode = '';

		while ((match = regexp.exec(code))) {
			if (count === 0) {
				newCode += code.substring(lastIndex, match.index);
			}

			if (match[0] === '/*') {
				count++;
			} else if (match[0] === '*/' && count > 0) {
				count--;
			}

			lastIndex = regexp.lastIndex;
		}

		newCode += code.substring(lastIndex);

		return newCode;
	}
}
