import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './IECMAScriptModuleCompiledResult.js';
import IECMAScriptModuleImport from './IECMAScriptModuleImport.js';
import ModuleURLUtility from './ModuleURLUtility.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Statement regexp.
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
 */
const STATEMENT_REGEXP =
	/import\.meta\.(url|resolve)|import\s*["']([^"']+)["'];{0,1}|import\s*\(([^)]+)\)|(import[\s{])|[\s}]from\s*["']([^"']+)["'](\s+with\s*{\s*type\s*:\s*["']([^"']+)["']\s*}){0,1}|export(\s+[a-zA-Z0-9-_$]+\s+|\s+\*\s+|\s+\*\s+as\s+["'a-zA-Z0-9-_$]+\s+|\s*{[^}]+}\s*)from\s*["']([^"']+)["']|(export\s*default\s*)|export\s*(function\*{0,1}|class)\s*([^({\s]+)|export\s*{([^}]+)}|export\s+(var|let|const)\s+([^=;]+)(=|;)/gm;

/**
 * Syntax regexp.
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
const SYNTAX_REGEXP = /(\/)|(\(|\))|({|})|(\[|\])|(\${)|(`)|(')|(")|(\n)/gm;

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
const PRECEDING_STATEMENT_TOKEN_REGEXP = /['"`(){}\s;=><\[\]+-,:&]/;

/**
 * Valid preceding token before a regexp.
 */
const PRECEDING_REGEXP_TOKEN_REGEXP = /['"`({};=><\[+-,:&]/;

/**
 * Multiline comment regexp.
 */
const MULTILINE_COMMENT_REGEXP = /\/\*|\*\//gm;

/**
 * ECMAScript module compiler.
 */
export default class ECMAScriptModuleCompiler {
	public readonly window: BrowserWindow;
	private debug = false;
	private count = {
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
	private debugCount: {
		comment: number[];
		singleLineComment: number[];
		parentheses: number[];
		curlyBraces: number[];
		squareBrackets: number[];
		regExp: number[];
		regExpSquareBrackets: number[];
		escapeTemplateString: number[];
		simpleString: number[];
		doubleString: number[];
	} = {
		comment: [],
		singleLineComment: [],
		parentheses: [],
		curlyBraces: [],
		squareBrackets: [],
		regExp: [],
		regExpSquareBrackets: [],
		escapeTemplateString: [],
		simpleString: [],
		doubleString: []
	};
	private templateString: number[] = [];

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
	 * @param sourceURL Source URL.
	 * @returns Result.
	 */
	public compile(
		moduleURL: string,
		code: string,
		sourceURL: string | null = null
	): IECMAScriptModuleCompiledResult {
		const browserSettings = new WindowBrowserContext(this.window).getSettings();

		if (!browserSettings) {
			return { imports: [], execute: async () => {} };
		}

		this.reset();

		const regExp = new RegExp(STATEMENT_REGEXP);
		const imports: IECMAScriptModuleImport[] = [];
		const exportSpreadVariables: Array<Map<string, string>> = [];
		const count = this.count;
		let newCode = `(async function anonymous($happy_dom) {`;
		let match: RegExpExecArray | null = null;
		let precedingToken: string;
		let textBetweenStatements: string;
		let isTopLevel = true;
		let lastIndex = 0;
		let importStartIndex = -1;

		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += 'try {\n';
		}

		while ((match = regExp.exec(code))) {
			precedingToken = code[match.index - 1] || ' ';
			textBetweenStatements = code.substring(lastIndex, match.index);

			this.parseSyntax(textBetweenStatements, lastIndex);

			if (importStartIndex === -1) {
				newCode += textBetweenStatements;
			}

			// Imports and exports are only valid outside any statement, string or comment at the top level
			isTopLevel =
				count.comment === 0 &&
				count.singleLineComment === 0 &&
				count.parentheses === 0 &&
				count.curlyBraces === 0 &&
				count.squareBrackets === 0 &&
				count.regExp === 0 &&
				count.simpleString === 0 &&
				count.doubleString === 0 &&
				this.templateString.length === 0;

			if (
				match[1] &&
				count.simpleString === 0 &&
				count.doubleString === 0 &&
				count.comment === 0 &&
				count.singleLineComment === 0 &&
				count.regExp === 0 &&
				(this.templateString.length === 0 || this.templateString[0] > 0) &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(this.getNonSpacePrecedingToken(code, match.index))
			) {
				// Import meta

				if (match[1] === 'url') {
					newCode += `$happy_dom.importMeta.url`;
				} else {
					newCode += `$happy_dom.importMeta.resolve`;
				}
			} else if (match[2] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Import without exported properties

				imports.push({
					url: ModuleURLUtility.getURL(this.window, moduleURL, match[2]).href,
					type: 'esm'
				});
			} else if (
				match[3] &&
				count.simpleString === 0 &&
				count.doubleString === 0 &&
				count.comment === 0 &&
				count.singleLineComment === 0 &&
				count.regExp === 0 &&
				(this.templateString.length === 0 || this.templateString[0] > 0) &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Dynamic import function call

				newCode += `$happy_dom.dynamicImport(${match[3]})`;
			} else if (match[4] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Import statement start
				if (importStartIndex !== -1) {
					throw new this.window.TypeError(
						`Failed to parse module: Unexpected import statement in "${moduleURL}"`
					);
				}
				importStartIndex = match.index + match[0].length - 1;
			} else if (match[5] && isTopLevel && importStartIndex !== -1) {
				// Import statement end

				const url = ModuleURLUtility.getURL(this.window, moduleURL, match[5]).href;
				const variables = code.substring(importStartIndex, match.index + 1);
				const importRegExp = new RegExp(IMPORT_REGEXP);
				const importCode: string[] = [];
				let importMatch: RegExpExecArray | null = null;
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
						importCode.push(`const ${importMatch[3]} = $happy_dom.imports.get('${url}').default`);
					}
				}
				newCode += importCode.join(';\n');
				importStartIndex = -1;
				imports.push({ url, type: match[7] || 'esm' });
			} else if (
				match[8] &&
				match[9] &&
				isTopLevel &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Export from module statement

				const url = ModuleURLUtility.getURL(this.window, moduleURL, match[9]).href;
				const imported = match[8].trim();

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
			} else if (match[10] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Export default statement

				newCode += '$happy_dom.exports.default = ';
			} else if (
				match[11] &&
				match[12] &&
				isTopLevel &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Export function or class type

				newCode += `$happy_dom.exports['${match[12]}'] = ${match[11]} ${match[12]}`;
			} else if (match[13] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
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
			} else if (match[14] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
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
			} else if (importStartIndex !== -1) {
				// Invalid import statement
				// E.g. "import defaultExport from invalid;" or just "import defaultExport;"

				const unparsed = code.substring(importStartIndex, match.index + 1);
				newCode += unparsed;
				this.parseSyntax(unparsed, importStartIndex);
			} else {
				// No valid statement found
				// This happens when there is a statement inside a string or comment
				// E.g. "const str = 'import defaultExport from invalid;';"

				newCode += match[0];
				this.parseSyntax(match[0], match.index);
			}

			lastIndex = regExp.lastIndex;
		}

		// In debug mode we don't want to execute the code, just take information from it
		if (this.debug) {
			return {
				imports,
				execute: async () => {}
			};
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
			newCode += `} catch(e) { $happy_dom.dispatchError(e); }`;
		}

		newCode += '})';

		try {
			return {
				imports,
				execute: this.window[PropertySymbol.evaluateScript](newCode, {
					filename: sourceURL || moduleURL
				})
			};
		} catch (e) {
			const errorMessage = this.getError(moduleURL, code, sourceURL) || (<Error>e).message;
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
					execute: async () => {}
				};
			}
		}
	}

	/**
	 * Parses syntax.
	 *
	 * @param code Code.
	 * @param index Index.
	 */
	private parseSyntax(code: string, index: number): void {
		const regExp = new RegExp(SYNTAX_REGEXP);
		const count = this.count;
		const debug = this.debug;
		const debugCount = this.debugCount;
		let match: RegExpExecArray | null = null;
		let precedingToken: string;
		let isEscaped: boolean;

		index++;

		while ((match = regExp.exec(code))) {
			precedingToken = code[match.index - 1] || ' ';
			isEscaped = precedingToken === '\\' && code[match.index - 2] !== '\\';

			if (match[1]) {
				// Slash (RegExp or Comment)
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.singleLineComment === 0 &&
					count.regExpSquareBrackets === 0 &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					if (count.comment === 1) {
						if (precedingToken === '*') {
							count.comment = 0;

							if (debug) {
								debugCount.comment.length = 0;
							}
						}
					} else {
						if (count.regExp === 0) {
							if (code[match.index + 1] === '*') {
								count.comment = 1;

								if (debug) {
									debugCount.comment = [index + match.index];
								}
							} else if (code[match.index + 1] === '/') {
								count.singleLineComment = 1;

								if (debug) {
									debugCount.singleLineComment = [index + match.index];
								}
							} else {
								if (
									PRECEDING_REGEXP_TOKEN_REGEXP.test(
										this.getNonSpacePrecedingToken(code, match.index)
									)
								) {
									count.regExp = 1;

									if (debug) {
										debugCount.regExp = [index + match.index];
									}
								}
							}
						} else if (!isEscaped) {
							count.regExp = 0;

							if (debug) {
								debugCount.regExp.length = 0;
							}
						}
					}
				}
			} else if (match[2]) {
				// Parentheses
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.regExp === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					if (match[2] === '(') {
						count.parentheses++;

						if (debug) {
							debugCount.parentheses.push(index + match.index);
						}
					} else if (match[2] === ')' && count.parentheses > 0) {
						count.parentheses--;

						if (debug) {
							debugCount.parentheses.pop();
						}
					}
				}
			} else if (match[3]) {
				// Curly braces
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.regExp === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					if (match[3] === '{') {
						if (this.templateString.length) {
							this.templateString[0]++;
						}
						count.curlyBraces++;

						if (debug) {
							debugCount.curlyBraces.push(index + match.index);
						}
					} else if (match[3] === '}') {
						if (this.templateString.length && this.templateString[0] > 0) {
							this.templateString[0]--;
						}
						if (count.curlyBraces > 0) {
							count.curlyBraces--;

							if (debug) {
								debugCount.curlyBraces.pop();
							}
						}
					}
				}
			} else if (match[4]) {
				// Square brackets
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					// We need to check for square brackets in RegExp as well to know when the RegExp ends
					if (count.regExp === 1) {
						if (!isEscaped) {
							if (match[4] === '[' && count.regExpSquareBrackets === 0) {
								count.regExpSquareBrackets = 1;

								if (debug) {
									debugCount.regExpSquareBrackets = [index + match.index];
								}
							} else if (match[4] === ']' && count.regExpSquareBrackets === 1) {
								count.regExpSquareBrackets = 0;

								if (debug) {
									debugCount.regExpSquareBrackets.length = 0;
								}
							}
						}
					} else {
						if (match[4] === '[') {
							count.squareBrackets++;

							if (debug) {
								debugCount.squareBrackets.push(index + match.index);
							}
						} else if (match[4] === ']' && count.squareBrackets > 0) {
							count.squareBrackets--;

							if (debug) {
								debugCount.squareBrackets.pop();
							}
						}
					}
				}
			} else if (match[5]) {
				// Escape template string (${)
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped
				) {
					if (this.templateString[0] === 0) {
						this.templateString[0] = 1;
						count.curlyBraces++;
						if (debug) {
							debugCount.curlyBraces.push(index + match.index);
						}
					}
				}
			} else if (match[6]) {
				// Template string
				if (
					count.simpleString === 0 &&
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped
				) {
					if (this.templateString?.[0] === 0) {
						this.templateString.shift();
					} else {
						this.templateString.unshift(0);
					}
				}
			} else if (match[7]) {
				// String apostrophe (')
				if (
					count.doubleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					if (count.simpleString === 0) {
						count.simpleString = 1;

						if (debug) {
							debugCount.simpleString = [index + match.index];
						}
					} else {
						count.simpleString = 0;

						if (debug) {
							debugCount.simpleString.length = 0;
						}
					}
				}
			} else if (match[8]) {
				// String apostrophe (")
				if (
					count.simpleString === 0 &&
					count.comment === 0 &&
					count.singleLineComment === 0 &&
					count.regExp === 0 &&
					!isEscaped &&
					(this.templateString.length === 0 || this.templateString[0] > 0)
				) {
					if (count.doubleString === 0) {
						count.doubleString = 1;

						if (debug) {
							debugCount.doubleString = [index + match.index];
						}
					} else {
						count.doubleString = 0;

						if (debug) {
							debugCount.doubleString.length = 0;
						}
					}
				}
			} else if (match[9]) {
				// Line feed character
				count.singleLineComment = 0;

				if (debug) {
					debugCount.singleLineComment.length = 0;
				}
			}
		}
	}

	/**
	 * Returns error.
	 *
	 * @param moduleURL Module URL.
	 * @param code Code.
	 * @param sourceURL Source URL.
	 * @returns Error.
	 */
	private getError(moduleURL: string, code: string, sourceURL: string | null): string | null {
		if (!this.debug) {
			this.debug = true;
			this.compile(moduleURL, code, sourceURL);
		}

		const debugCount = this.debugCount;

		if (debugCount.comment.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.comment[0]);
			return `Missing end of comment on line ${line} and column ${column}`;
		} else if (debugCount.regExp.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.regExp[0]);
			return `Missing end of regular expression on line ${line} and column ${column}`;
		} else if (debugCount.regExpSquareBrackets.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.regExpSquareBrackets[0]);
			return `Missing end of regular expression square brackets on line ${line} and column ${column}`;
		} else if (debugCount.simpleString.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.simpleString[0]);
			return `Missing end of single quote string on line ${line} and column ${column}`;
		} else if (debugCount.doubleString.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.doubleString[0]);
			return `Missing end of double quote string on line ${line} and column ${column}`;
		} else if (debugCount.parentheses.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.parentheses[0]);
			return `Missing end of parentheses on line ${line} and column ${column}`;
		} else if (debugCount.curlyBraces.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.curlyBraces[0]);
			return `Missing end of curly braces on line ${line} and column ${column}`;
		} else if (debugCount.squareBrackets.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.squareBrackets[0]);
			return `Missing end of square brackets on line ${line} and column ${column}`;
		} else if (debugCount.escapeTemplateString.length > 0) {
			const { line, column } = this.getLineAndColumn(code, debugCount.escapeTemplateString[0]);
			return `Missing end of escaped template string on line ${line} and column ${column}`;
		}

		return null;
	}

	/**
	 * Returns line and column for an error.
	 *
	 * @param code Code.
	 * @param index Index.
	 * @returns Line and column.
	 */
	private getLineAndColumn(code: string, index: number): { line: number; column: number } {
		const lines = code.substring(0, index).split('\n');
		const line = lines.length;
		const column = lines[lines.length - 1].length;
		return { line, column };
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
		let match: RegExpExecArray | null;
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

	/**
	 * Resets the compiler state.
	 */
	private reset(): void {
		this.count = {
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
		this.debugCount = {
			comment: [],
			singleLineComment: [],
			parentheses: [],
			curlyBraces: [],
			squareBrackets: [],
			regExp: [],
			regExpSquareBrackets: [],
			escapeTemplateString: [],
			simpleString: [],
			doubleString: []
		};
		this.templateString = [];
	}
}
