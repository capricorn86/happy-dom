import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './IECMAScriptModuleCompiledResult.js';
import IECMAScriptModuleImport from './IECMAScriptModuleImport.js';
import ModuleURLUtility from './ModuleURLUtility.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Code regexp.
 *
 * Group 1: Import meta.
 * Group 2: Import without exported properties.
 * Group 3: Dynamic import function call.
 * Group 4: Import exported variables.
 * Group 5: Import exported url.
 * Group 6: Import with group.
 * Group 7: Import with type.
 * Group 8: Modules in export from module statement.
 * Group 9: Import in export from module statement.
 * Group 10: Export default statement.
 * Group 11: Export function or class type.
 * Group 12: Export function or class name.
 * Group 13: Export object.
 * Group 14: Export variable type (var, let or const).
 * Group 15: Export variable name.
 * Group 16: Export variable name end character (= or ;).
 * Group 17: Slash (RegExp or comment).
 * Group 18: Parentheses.
 * Group 19: Curly braces.
 * Group 20: Square brackets.
 * Group 21: Escape template string (${).
 * Group 22: Template string apostrophe (`).
 * Group 23: String apostrophe (').
 * Group 24: String apostrophe (").
 * Group 25: Line feed character.
 */
const CODE_REGEXP =
	/import\.meta\.(url|resolve)|import\s*["']([^"'()\s]+)["'];{0,1}|import\s*\(([^)]+)\)|(import[\s{])|[\s}]from\s*["']([^"'()\s]+)["'](\s+with\s*{\s*type\s*:\s*["']([^"']+)["']\s*}){0,1}|export\s([a-zA-Z0-9-_$]+|\*|\*\s+as\s+["'a-zA-Z0-9-_$]+|{[^}]+})\s*from\s["']([^"'()\s]+)["']|(export\s*default\s*)|export\s*(function\*{0,1}|class)\s*([^({\s]+)|export\s*{([^}]+)}|export\s+(var|let|const)\s+([^=;]+)(=|;)|(\/)|(\(|\))|({|})|(\[|\])|(\${)|(`)|(')|(")|(\n)/gm;

/**
 * Code without imports and exports regexp.
 *
 * Group 1: Slash (RegExp or comment).
 * Group 2: Parentheses.
 * Group 3: Curly braces.
 * Group 4: Square brackets.
 * Group 5: Escape template string (${).
 * Group 6: Template string apostrophe (`).
 * Group 7: String apostrophe (').
 * Group 8: String apostrophe (").
 * Group 9: Line feed character.
 */
// const CODE_WITHOUT_IMPORTS_REGEXP = /(\/)|(\(|\))|({|})|(\[|\])|(\${)|(`)|(')|(")|(\n)/gm;

/**
 * Import regexp.
 *
 * Group 1: Import braces.
 * Group 2: Import all as.
 * Group 3: Import default.
 */
const IMPORT_REGEXP = /{([^}]+)}|\*\s+as\s+([a-zA-Z0-9-_$]+)|([a-zA-Z0-9-_$]+)/gm;

/**
 * Valid preceding token before a statement.
 */
const PRECEDING_STATEMENT_TOKEN_REGEXP = /['"`(){}\s;=>]/;

/**
 * Valid preceding token before a regexp.
 */
const PRECEDING_REGEXP_TOKEN_REGEXP = /[([={},;"'+-]/;

/**
 * Multiline comment regexp.
 */
const MULTILINE_COMMENT_REGEXP = /\/\*|\*\//gm;

/**
 * ECMAScript module compiler.
 */
export default class ECMAScriptModuleCompiler {
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
	 * Compiles code and returns imports and compiled code.
	 *
	 * @param moduleURL Module URL.
	 * @param code Code.
	 * @returns Result.
	 */
	public compile(moduleURL: string, code: string): IECMAScriptModuleCompiledResult {
		const browserSettings = new WindowBrowserContext(this.window).getSettings();

		if (!browserSettings) {
			return { imports: [], execute: () => {} };
		}

		const regExp = new RegExp(CODE_REGEXP);
		const imports: IECMAScriptModuleImport[] = [];
		const count = {
			comment: 0,
			singleLineComment: 0,
			parentheses: 0,
			curlyBraces: 0,
			squareBrackets: 0,
			regExp: 0,
			regExpSquareBrackets: 0,
			escapeTemplateString: 0,
			simpleString: 0,
			doubleString: 0
		};
		const stack: { templateString: { index: number | null; code: string[] } } = {
			templateString: { index: null, code: [] }
		};
		const templateString: number[] = [];
		const exportSpreadVariables: Array<Map<string, string>> = [];
		let newCode = `(async function anonymous($happy_dom) {\n//# sourceURL=${moduleURL}\n`;
		let match: RegExpExecArray;
		let precedingToken: string;
		let isEscaped: boolean;
		let lastIndex = 0;
		let importStartIndex = -1;
		let skipMatchedCode = false;

		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += 'try {\n';
		}

		while ((match = regExp.exec(code))) {
			if (importStartIndex === -1) {
				newCode += code.substring(lastIndex, match.index);
			}
			precedingToken = code[match.index - 1] || ' ';
			isEscaped = precedingToken === '\\' && code[match.index - 2] !== '\\';

			// Imports and exports are only valid outside any statement, string or comment at the top level
			if (
				count.comment === 0 &&
				count.singleLineComment === 0 &&
				count.parentheses === 0 &&
				count.curlyBraces === 0 &&
				count.squareBrackets === 0 &&
				count.regExp === 0 &&
				count.simpleString === 0 &&
				count.doubleString === 0 &&
				templateString.length === 0
			) {
				if (match[2] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Import without exported properties
					imports.push({
						url: ModuleURLUtility.getURL(this.window, moduleURL, match[2]).href,
						type: 'esm'
					});
					skipMatchedCode = true;
				} else if (match[4] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Import statement start
					if (importStartIndex !== -1) {
						throw new this.window.TypeError(
							`Failed to parse module: Unexpected import statement in "${moduleURL}"`
						);
					}
					importStartIndex = match.index + match[0].length - 1;
					skipMatchedCode = true;
				} else if (match[5]) {
					// Import statement end
					if (importStartIndex !== -1) {
						const url = ModuleURLUtility.getURL(this.window, moduleURL, match[5]).href;
						const variables = code.substring(importStartIndex, match.index + 1);
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
						imports.push({ url, type: match[7] || 'esm' });
						skipMatchedCode = true;
					}
				} else if (match[8] && match[9] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export from module statement

					const url = ModuleURLUtility.getURL(this.window, moduleURL, match[9]).href;
					const imported = match[8];

					if (imported === '*') {
						newCode += `Object.assign($happy_dom.exports, $happy_dom.imports.get('${url}'))`;
						imports.push({ url, type: 'esm' });
					} else if (imported[0] === '*') {
						const parts = imported.split(/\s+as\s+/);
						if (parts.length === 2) {
							const exportName = parts[1].replace(/["']/g, '');
							newCode += `$happy_dom.exports['${exportName}'] = $happy_dom.imports.get('${url}')`;
							imports.push({ url, type: 'esm' });
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
						imports.push({ url, type: 'esm' });
					}
					skipMatchedCode = true;
				} else if (match[10] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export default statement
					newCode += '$happy_dom.exports.default = ';
					skipMatchedCode = true;
				} else if (
					match[11] &&
					match[12] &&
					PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
				) {
					// Export function or class type
					newCode += `$happy_dom.exports['${match[12]}'] = ${match[11]} ${match[12]}`;
					skipMatchedCode = true;
				} else if (match[13] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export object
					const parts = this.removeMultilineComments(match[13]).split(/\s*,\s*/);
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
				} else if (match[14] && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
					// Export variable
					if (match[16] === '=') {
						const exportName = this.removeMultilineComments(match[15]).trim();
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
						// TODO: If there is no =, we should ignore until we know what it is useful for
						// Example: export let name1, name2, name3;
						newCode += `/*Unknown export: ${match[0]}*/`;
						this.window.console.warn(`Unknown export in "${moduleURL}": ${match[0]}`);
					}
					skipMatchedCode = true;
				}
			}

			if (match[1]) {
				// Import meta
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					(templateString.length === 0 || templateString[0] > 0) &&
					PRECEDING_REGEXP_TOKEN_REGEXP.test(this.getNonSpacePrecedingToken(code, match.index))
				) {
					if (match[1] === 'url') {
						newCode += `$happy_dom.importMeta.url`;
					} else {
						newCode += `$happy_dom.importMeta.resolve`;
					}
					skipMatchedCode = true;
				}
			} else if (match[3]) {
				// Dynamic import function call
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					(templateString.length === 0 || templateString[0] > 0) &&
					PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
				) {
					newCode += `$happy_dom.dynamicImport(${match[3]})`;
					skipMatchedCode = true;
				}
			} else if (match[17]) {
				// Slash (RegExp or Comment)
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.singleLineComment === 0 &&
					count.regExpSquareBrackets === 0 &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					if (count.comment === 1) {
						if (precedingToken === '*') {
							count.comment = 0;
						}
					} else {
						if (count.regExp === 0) {
							if (code[match.index + 1] === '*') {
								count.comment = 1;
							} else if (code[match.index + 1] === '/') {
								count.singleLineComment = 1;
							} else {
								if (!isEscaped) {
									if (
										PRECEDING_REGEXP_TOKEN_REGEXP.test(
											this.getNonSpacePrecedingToken(code, match.index)
										)
									) {
										count.regExp = 1;
									}
								}
							}
						} else if (!isEscaped) {
							count.regExp = 0;
						}
					}
				}
			} else if (match[18]) {
				// Parentheses
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.regExp === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					if (match[18] === '(') {
						count.parentheses++;
					} else if (match[18] === ')' && count.parentheses > 0) {
						count.parentheses--;
					}
				}
			} else if (match[19]) {
				// Curly braces
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.regExp === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					if (match[19] === '{') {
						if (templateString.length) {
							templateString[0]++;
						}
						count.curlyBraces++;
					} else if (match[19] === '}') {
						if (templateString.length && templateString[0] > 0) {
							templateString[0]--;
						}
						if (count.curlyBraces > 0) {
							count.curlyBraces--;
						}
					}
				}
			} else if (match[20]) {
				// Square brackets
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					// We need to check for square brackets in RegExp as well to know when the RegExp ends
					if (count.regExp === 1) {
						if (!isEscaped) {
							if (match[20] === '[' && count.regExpSquareBrackets === 0) {
								count.regExpSquareBrackets = 1;
							} else if (match[20] === ']' && count.regExpSquareBrackets === 1) {
								count.regExpSquareBrackets = 0;
							}
						}
					} else {
						if (match[20] === '[') {
							count.squareBrackets++;
						} else if (match[20] === ']' && count.squareBrackets > 0) {
							count.squareBrackets--;
						}
					}
				}
			} else if (match[21]) {
				// Escape template string (${)
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped
				) {
					if (templateString.length > 0) {
						templateString[0]++;
					}
					count.curlyBraces++;
				}
			} else if (match[22]) {
				// Template string
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped
				) {
					if (templateString?.[0] == 0) {
						templateString.shift();
						stack.templateString.code.push(
							code.substring(stack.templateString.index, match.index + 1)
						);
					} else {
						templateString.unshift(0);
						stack.templateString.index = match.index;
					}
				}
			} else if (match[23]) {
				// String apostrophe (')
				if (
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					if (count.simpleString === 0) {
						count.simpleString = 1;
					} else {
						count.simpleString = 0;
					}
				}
			} else if (match[24]) {
				// String apostrophe (")
				if (
					count.simpleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped &&
					(templateString.length === 0 || templateString[0] > 0)
				) {
					if (count.doubleString === 0) {
						count.doubleString = 1;
					} else {
						count.doubleString = 0;
					}
				}
			} else if (match[25]) {
				// Line feed character
				count.singleLineComment = 0;
			}

			// Unless the code has been handled by transforming imports or exports, we add it to the new code
			if (!skipMatchedCode && importStartIndex === -1) {
				newCode += match[0];
			}

			skipMatchedCode = false;
			lastIndex = regExp.lastIndex;
		}

		if (importStartIndex !== -1) {
			// We will end up here if there is an import statement without a valid "from" part
			// E.g. "import defaultExport from invalid;" or just "import defaultExport;"
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

		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += `\n} catch(e) {\n   $happy_dom.dispatchError(e);\n}`;
		}

		newCode += '\n})';

		try {
			return { imports, execute: this.window.eval(newCode) };
		} catch (e) {
			const errorMessage = this.getUnmatchedError(count) || e.message;
			const error = new this.window.SyntaxError(
				`Failed to parse module '${moduleURL}': ${errorMessage}`
			);
			if (
				browserSettings.disableErrorCapturing ||
				browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
			) {
				throw error;
			} else {
				this.window[PropertySymbol.dispatchError](error);
				return {
					imports,
					execute: () => {}
				};
			}
		}
	}

	/**
	 * Returns unmatched error.
	 *
	 * @param count Count.
	 * @param count.comment Comment.
	 * @param count.parentheses Parentheses.
	 * @param count.curlyBraces Curly braces.
	 * @param count.squareBrackets Square brackets.
	 * @param count.regExp Regular expression.
	 * @param count.regExpSquareBrackets Regular expression square brackets.
	 * @param count.escapeTemplateString Escape template string.
	 * @param count.simpleString Simple string.
	 * @param count.doubleString Double string.
	 * @returns Unmatched error.
	 */
	private getUnmatchedError(count: {
		comment: number;
		parentheses: number;
		curlyBraces: number;
		squareBrackets: number;
		regExp: number;
		regExpSquareBrackets: number;
		escapeTemplateString: number;
		simpleString: number;
		doubleString: number;
	}): string | null {
		if (count.comment > 0) {
			return `Missing end of comment (*/)`;
		} else if (count.regExp > 0) {
			return 'Missing end of regular expression (/)';
		} else if (count.regExpSquareBrackets > 0) {
			return 'Missing end of regular expression square brackets (])';
		} else if (count.simpleString > 0) {
			return "Missing end of single quote string (')";
		} else if (count.doubleString > 0) {
			return 'Missing end of double quote string (")';
		} else if (count.parentheses > 0) {
			return 'Missing end of parentheses';
		} else if (count.curlyBraces > 0) {
			return 'Missing end of curly braces (})';
		} else if (count.squareBrackets > 0) {
			return 'Missing end of square brackets (])';
		} else if (count.escapeTemplateString > 0) {
			return 'Missing end of escaped template string (`)';
		}

		return null;
	}

	/**
	 * Get the non-space preceding token.
	 *
	 * @param code Code.
	 * @param index Index.
	 * @returns Non-space preceding token.
	 */
	private getNonSpacePrecedingToken(code: string, index: number): string {
		index--;
		let nonSpacePrecedingToken = code[index];

		while (nonSpacePrecedingToken === ' ' || nonSpacePrecedingToken === '\n') {
			index--;
			nonSpacePrecedingToken = code[index];
		}

		return nonSpacePrecedingToken;
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
