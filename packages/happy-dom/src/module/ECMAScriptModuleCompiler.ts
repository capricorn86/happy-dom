import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import IECMAScriptModuleCompiledResult from './types/IECMAScriptModuleCompiledResult.js';
import IECMAScriptModuleImport from './types/IECMAScriptModuleImport.js';
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
 * Group 8: Import spacing.
 * Group 9: Modules in export from module statement.
 * Group 10: Import in export from module statement.
 * Group 11: Export default indicator.
 * Group 12: Export async function indicator.
 * Group 13: Export function or class type.
 * Group 14: Export function or class name.
 * Group 15: Export default statement that is not a function or class.
 * Group 16: Export object.
 * Group 17: Export variable type (var, let or const).
 * Group 18: Export variable name.
 * Group 19: Export variable name end character (= or ;).
 */
const STATEMENT_REGEXP =
	/import\.meta\.([a-zA-Z]+)|import\s*["']([^"']+)["'];{0,1}|import\s*\(([^)]+)\)|(import[\s{])|[\s}]from\s*["']([^"']+)["'](\s+with\s*{\s*type\s*:\s*["']([^"']+)["']\s*}){0,1}([;\s]*)|export(\s+[a-zA-Z0-9-_$]+\s+|\s+\*\s+|\s+\*\s+as\s+["'a-zA-Z0-9-_$]+\s+|\s*{[^}]+}\s*)from\s*["']([^"']+)["']|export\s*(default\s+){0,1}(async\s+){0,1}(function\*{0,1}|class)\s*([^({\s]+)|(export\s*default\s*)|export\s*{([^}]+)}|export\s+(var|let|const)\s+([^=;]+)(=|;)/gm;

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
 * Export regexp.
 */
const EXPORT_REGEXP = /export\s*/;

/**
 * Export default regexp.
 */
const EXPORT_DEFAULT_REGEXP = /export\s*default\s*/;

/**
 * Ends with semicolon regexp.
 */
const ENDS_WITH_SEMICOLON_REGEXP = /;\s*$/;

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
		const resolvableCircularImports: Array<{
			url: string;
			properties: Array<{ name: string; alias?: string }>;
		}> = [];
		const count = this.count;
		let newCode = '';
		let newCodeStart = '';
		let newCodeEnd = '';
		let match: RegExpExecArray | null = null;
		let precedingToken: string;
		let textBetweenStatements: string;
		let isTopLevel = true;
		let lastIndex = 0;
		let importStartIndex = -1;

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
				newCode += `$happy_dom.importMeta.${match[1]}`;
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
				let importMatch: RegExpExecArray | null = null;
				while ((importMatch = importRegExp.exec(variables))) {
					if (importMatch[1]) {
						// Import braces
						const parts = this.removeMultilineComments(importMatch[1]).split(/\s*,\s*/);
						const properties: Array<{ name: string; alias?: string }> = [];
						for (const part of parts) {
							const nameParts = part.trim().split(/\s+as\s+/);
							const alias = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
							const name = nameParts[0].replace(/["']/g, '');
							if (alias && name) {
								if (name === alias) {
									properties.push({ name });
								} else {
									properties.push({ name, alias });
								}
							}
						}
						if (!match[7] || match[7] === 'esm') {
							resolvableCircularImports.push({ url, properties });
						}
						newCodeStart += `let {${properties.map((property) => (property.alias ? `"${property.name}": ${property.alias}` : property.name)).join(', ')}} = $happy_dom.imports.get('${url}')${match[8]}`;
					} else if (importMatch[2]) {
						// Import all as
						newCodeStart += `const ${importMatch[2]} = $happy_dom.imports.get('${url}')${match[8]}`;
					} else if (importMatch[3]) {
						// Import default
						if (!match[7] || match[7] === 'esm') {
							resolvableCircularImports.push({
								url,
								properties: [{ name: 'default', alias: importMatch[3] }]
							});
						}
						newCodeStart += `let ${importMatch[3]} = $happy_dom.imports.get('${url}').default${match[8]}`;
					}
				}
				importStartIndex = -1;
				imports.push({ url, type: match[7] || 'esm' });
			} else if (
				match[9] &&
				match[10] &&
				isTopLevel &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Export from module statement

				const url = ModuleURLUtility.getURL(this.window, moduleURL, match[10]).href;
				const imported = match[9].trim();

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
			} else if (
				match[13] &&
				match[14] &&
				isTopLevel &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Export function or class type

				const name = match[14].replace('*', '');

				if (name) {
					if (match[11]) {
						newCode += match[0].replace(EXPORT_DEFAULT_REGEXP, '');
						newCodeEnd += `$happy_dom.exports.default = ${name};\n`;
					} else {
						newCode += match[0].replace(EXPORT_REGEXP, '');
						newCodeEnd += `$happy_dom.exports['${name}'] = ${name};\n`;
					}
				} else {
					if (match[11]) {
						newCode += `$happy_dom.exports.default = ${match[12] || ''}${match[13]}${name ? ' ' : ''}${match[14]}`;
					} else {
						throw new this.window.SyntaxError(
							`Failed to parse module: Missing function or class name in export statement in "${moduleURL}"`
						);
					}
				}
			} else if (match[15] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Export default statement

				newCode += '$happy_dom.exports.default = ';
			} else if (match[16] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Export object

				const parts = this.removeMultilineComments(match[16]).split(/\s*,\s*/);
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
			} else if (match[17] && isTopLevel && PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)) {
				// Export variable

				if (match[19] === '=') {
					const exportName = this.removeMultilineComments(match[18]).trim();
					if (
						(exportName[0] === '{' && exportName[exportName.length - 1] === '}') ||
						(exportName[0] === '[' && exportName[exportName.length - 1] === ']')
					) {
						const parts = exportName.slice(1, -1).split(/\s*,\s*/);

						for (const part of parts) {
							const nameParts = part.trim().split(/\s*:\s*/);
							const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
							if (exportName) {
								newCodeEnd += `$happy_dom.exports['${exportName}'] = ${exportName};\n`;
							}
						}

						newCode += match[0].replace(EXPORT_REGEXP, '');
					} else {
						newCode += match[0].replace(EXPORT_REGEXP, '');
						newCodeEnd += `$happy_dom.exports['${exportName}'] = ${exportName};\n`;
					}
				} else {
					// Example: export let name1, name2, name3;
					newCode += match[0].replace(EXPORT_REGEXP, '');
					const parts = this.removeMultilineComments(match[18]).split(',');
					for (const part of parts) {
						const exportName = part.trim();
						newCodeEnd += `$happy_dom.exports['${exportName}'] = ${exportName};\n`;
					}
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

		if (!!newCodeStart && !ENDS_WITH_SEMICOLON_REGEXP.test(newCodeStart)) {
			newCodeStart = `\n${newCodeStart};`;
		}
		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCodeStart = '(async function anonymous($happy_dom) { try {' + newCodeStart;
		} else {
			newCodeStart = '(async function anonymous($happy_dom) {' + newCodeStart;
		}

		newCode = newCodeStart + newCode;

		if (lastIndex === 0) {
			newCode += code;
		} else {
			newCode += code.substring(lastIndex);
		}

		newCode += '\n' + newCodeEnd;

		if (resolvableCircularImports.length > 0) {
			newCode += '$happy_dom.addCircularImportResolver(() => {\n';
			for (const circularImport of resolvableCircularImports) {
				for (const property of circularImport.properties) {
					if (property.alias) {
						newCode += `${property.alias} = $happy_dom.imports.get('${circularImport.url}')['${property.name}'];\n`;
					} else {
						newCode += `${property.name} = $happy_dom.imports.get('${circularImport.url}')['${property.name}'];\n`;
					}
				}
			}
			newCode += '});';
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
			const compileError = this.getError(moduleURL, code, sourceURL);
			const error = compileError
				? new this.window.SyntaxError(
						`Failed to parse module in '${moduleURL}'. Execution error: ${(<Error>e).message}. Compile error: ${compileError}`
					)
				: <Error>e;

			(<Error>e).message = `Failed to parse module in '${sourceURL}': ${(<Error>error).message}`;

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
		if (
			this.count.comment === 0 &&
			this.count.singleLineComment === 0 &&
			this.count.parentheses === 0 &&
			this.count.curlyBraces === 0 &&
			this.count.squareBrackets === 0 &&
			this.count.regExp === 0 &&
			this.count.regExpSquareBrackets === 0 &&
			this.count.simpleString === 0 &&
			this.count.doubleString === 0
		) {
			return null;
		}

		// Enable debug mode to get error information
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

		while (
			nonSpacePrecedingToken === ' ' ||
			nonSpacePrecedingToken === '\n' ||
			nonSpacePrecedingToken === '\t'
		) {
			index--;
			nonSpacePrecedingToken = code[index];
		}

		return nonSpacePrecedingToken || ';';
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
