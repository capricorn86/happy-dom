import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IJavaScriptCompiledResult from './IJavaScriptCompiledResult.js';

/**
 * Statement regexp.
 *
 * Group 1: Dynamic import function call.
 */
const STATEMENT_REGEXP = /import\s*\(([^)]+)\)/gm;

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
 * Valid preceding token before a statement.
 */
const PRECEDING_STATEMENT_TOKEN_REGEXP = /['"`(){}\s;=><\[\]+-,:&]/;

/**
 * Valid preceding token before a regexp.
 */
const PRECEDING_REGEXP_TOKEN_REGEXP = /['"`({};=><\[+-,:&]/;

/**
 * ECMAScript module compiler.
 */
export default class JavaScriptCompiler {
	public readonly window: BrowserWindow;
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
	 * Compiles code.
	 *
	 * @param sourceURL Source URL.
	 * @param code Code.
	 * @returns Result.
	 */
	public compile(sourceURL: string, code: string): IJavaScriptCompiledResult {
		const browserSettings = new WindowBrowserContext(this.window).getSettings();

		if (!browserSettings) {
			return { execute: () => {} };
		}

		const regExp = new RegExp(STATEMENT_REGEXP);
		const count = this.count;
		let newCode = '(function anonymous($happy_dom) {';
		let match: RegExpExecArray | null = null;
		let precedingToken: string;
		let textBetweenStatements: string;
		let lastIndex = 0;
		const importStartIndex = -1;

		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += 'try {';
		}

		while ((match = regExp.exec(code))) {
			precedingToken = code[match.index - 1] || ' ';
			textBetweenStatements = code.substring(lastIndex, match.index);

			this.parseSyntax(textBetweenStatements, lastIndex);

			if (importStartIndex === -1) {
				newCode += textBetweenStatements;
			}

			if (
				match[1] &&
				count.simpleString === 0 &&
				count.doubleString === 0 &&
				count.comment === 0 &&
				count.singleLineComment === 0 &&
				count.regExp === 0 &&
				(this.templateString.length === 0 || this.templateString[0] > 0) &&
				PRECEDING_STATEMENT_TOKEN_REGEXP.test(precedingToken)
			) {
				// Dynamic import function call

				newCode += `$happy_dom.dynamicImport(${match[1]})`;
			} else {
				// No valid statement found
				// This happens when there is a statement inside a string or comment
				// E.g. "const str = 'import defaultExport from invalid;';"

				newCode += match[0];
				this.parseSyntax(match[0], match.index);
			}

			lastIndex = regExp.lastIndex;
		}

		if (lastIndex === 0) {
			newCode += code;
		} else {
			newCode += code.substring(lastIndex);
		}

		if (
			!browserSettings.disableErrorCapturing &&
			browserSettings.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
		) {
			newCode += '} catch (error) { $happy_dom.dispatchError(error); }';
		}

		newCode += '})';

		try {
			return {
				execute: this.window[PropertySymbol.evaluateScript](newCode, {
					filename: sourceURL
				})
			};
		} catch (error) {
			(<Error>error).message =
				`Failed to parse JavaScript in '${sourceURL}': ${(<Error>error).message}`;
			if (
				browserSettings.disableErrorCapturing ||
				browserSettings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
			) {
				throw error;
			} else {
				this.window[PropertySymbol.dispatchError](<Error>error);
				return {
					execute: () => {}
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
						}
					} else {
						if (count.regExp === 0) {
							if (code[match.index + 1] === '*') {
								count.comment = 1;
							} else if (code[match.index + 1] === '/') {
								count.singleLineComment = 1;
							} else {
								if (
									PRECEDING_REGEXP_TOKEN_REGEXP.test(
										this.getNonSpacePrecedingToken(code, match.index)
									)
								) {
									count.regExp = 1;
								}
							}
						} else if (!isEscaped) {
							count.regExp = 0;
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
					} else if (match[2] === ')' && count.parentheses > 0) {
						count.parentheses--;
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
					} else if (match[3] === '}') {
						if (this.templateString.length && this.templateString[0] > 0) {
							this.templateString[0]--;
						}
						if (count.curlyBraces > 0) {
							count.curlyBraces--;
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
							} else if (match[4] === ']' && count.regExpSquareBrackets === 1) {
								count.regExpSquareBrackets = 0;
							}
						}
					} else {
						if (match[4] === '[') {
							count.squareBrackets++;
						} else if (match[4] === ']' && count.squareBrackets > 0) {
							count.squareBrackets--;
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
					} else {
						count.simpleString = 0;
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
					} else {
						count.doubleString = 0;
					}
				}
			} else if (match[9]) {
				// Line feed character
				count.singleLineComment = 0;
			}
		}
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
}
