import BrowserWindow from '../window/BrowserWindow.js';

/**
 * Code regexp.
 *
 * Group 1: Import exported variables.
 * Group 2: Import exported url.
 * Group 3: Import without name part.
 * Group 4: Modules in export from module statement.
 * Group 5: Import in export from module statement.
 * Group 6: Export default statement.
 * Group 7: Export function or class type.
 * Group 8: Export function or class name.
 * Group 9: Export object.
 * Group 10: Export variable type (var, let or const).
 * Group 11: Export variable name.
 * Group 12: Export variable name end character (= or ;).
 * Group 13: Single line comment.
 * Group 14: Multi line comment.
 * Group 15: Slash (RegExp).
 * Group 16: Parentheses.
 * Group 17: Curly braces.
 * Group 18: Square brackets.
 * Group 19: String apostrophe (', " or `).
 */
const CODE_REGEXP = /(import\s+)|\sfrom\s["']([^"']+)["']|export\s(.+)\sfrom\s["']([^"']+)["'];|(export\sdefault\s)|export\s(function\*{0,1}|class)\s([^({\s]+)|export\s{([^}]+)}|export\s(var|let|const)\s+([^=;]+)(=|;)|(\/\/.*$)|(\/\*|\*\/)|(\/)|(\(|\))|({|})|(\[|\])|('|"|`)/gm;

/**
 * Import regexp.
 * 
 * Group 1: Import braces.
 * Group 2: Import all as.
 * Group 3: Import default.
 */
const IMPORT_REGEXP = /{([^}]+)}|\*\s+as\s+([a-zA-Z0-9-_$]+)|([a-zA-Z0-9-_$]+)/gm;

/**
 * Module parser.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
 */
export default class ModuleParser {
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
	public parse(moduleURL: string, code: string): { imports: string[]; code: string } {
		const regExp = new RegExp(CODE_REGEXP);
		const imports: string[] = [];
		const count = {
			comment: 0,
			parantheses: 0,
			curlyBraces: 0,
			squareBrackets: 0,
			regExp: 0
		};
		const exportSpreadVariables: Array<Map<string, string>> = [];
		let newCode = '';
		let match: RegExpExecArray;
		let precedingToken: string;
		let stringCharacter: string | null = null;
		let lastIndex = 0;
		let importStartIndex = -1;
		let skipCode = false;

		while ((match = regExp.exec(code))) {
			precedingToken = code[match.index - 1];
            if (match[11]) {
                // Ignore single line comment
            } else if (match[12]) {
                // Multi line comment
                if (match[12] === '/*') {
                    count.comment++;
                } else if (match[12] === '*/' && count.comment > 0) {
                    count.comment--;
                }
            } else if (match[13]) {
                // Slash (RegExp)
                if (precedingToken !== '\\') {
                    count.regExp = count.regExp === 0 ? 1 : 0;
                }
            } else if (match[14]) {
                // Parentheses
                if (match[14] === '(') {
                    count.parantheses++;
                }
                if (match[14] === ')' && count.parantheses > 0) {
                    count.parantheses--;
                }
            } else if (match[15]) {
                // Curly braces
                if (match[15] === '{') {
                    count.curlyBraces++;
                }
                if (match[15] === '}' && count.curlyBraces > 0) {
                    count.curlyBraces--;
                }
            } else if (match[16]) {
                // Square brackets
                if (match[16] === '[') {
                    count.squareBrackets++;
                }
                if (match[16] === ']' && count.squareBrackets > 0) {
                    count.squareBrackets--;
                }
            } else if (match[17]) {
                // String
                if (precedingToken !== '\\') {
                    if (stringCharacter === null) {
                        stringCharacter = match[7];
                    } else if (stringCharacter === match[7]) {
                        stringCharacter = null;
                    }
                }
            } else if (count.curlyBraces === 0 && count.squareBrackets === 0) {
                /**
                 * Code regexp.
                 *
                 * Group 1: Import name.
                 * Group 2: Import URL.
                 * Group 3: Import without name.
                 * Group 4: Modules in export from module statement.
                 * Group 5: Import in export from module statement.
                 * Group 6: Export default statement.
                 * Group 7: Export function or class type.
                 * Group 8: Export function or class name.
                 * Group 9: Export object.
                 * Group 10: Export variable type (var, let or const).
                 * Group 11: Export variable name.
                 * Group 12: Export variable name end character (= or ;).
                 * Group 13: Single line comment.
                 * Group 14: Multi line comment.
                 * Group 15: Slash (RegExp).
                 * Group 16: Parentheses.
                 * Group 17: Curly braces.
                 * Group 18: Square brackets.
                 * Group 19: String apostrophe (', " or `).
                 */
                if (match[1]) {
                    // Import statement start
                    importStartIndex = match.index + match[0].length;
                    skipCode = true;
                } else if(match[2]) {
                    // Import statement end
                    if(importStartIndex !== -1) {
                        const url = new URL(match[2], moduleURL).href;
                        const variables = code.substring(importStartIndex, match.index);
                        const importRegExp = new RegExp(IMPORT_REGEXP);
                        let importMatch: RegExpExecArray;
                        while((importMatch = importRegExp.exec(variables))) {
                            if(importMatch[1]) {
                                // Import braces
                                newCode += `const { ${importMatch[1].replace(/\s+as\s+/gm, ': ')} } = __happy_dom_imports__.get('${url}');\n`;
                            } else if(importMatch[2]) {
                                // Import all as
                                newCode += `const ${importMatch[2]} = __happy_dom_imports__.get('${url}');\n`;
                            }
                        }
                        skipCode = true;
                    }
                } else if (match[9] && match[10]) {
                    const url = new URL(match[10], moduleURL).href;
                    const imported = match[9];

                    newCode += code.substring(lastIndex, match.index);

                    // Export from module statement
                    if (imported === '*') {
                        newCode += `Object.assign(__happy_dom_exports__, __happy_dom_imports__.get('${url}'))`;
                        imports.push(url);
                    } else if (imported[0] === '*') {
                        const parts = imported.split(/\s+as\s+/);
                        if (parts.length === 2) {
                            const exportName = parts[1].replace(/["']/g, '');
                            newCode += `__happy_dom_exports__['${exportName}'] = __happy_dom_imports__.get('${url}')`;
                            imports.push(url);
                        }
                    } else if (imported[0] === '{' && imported[imported.length - 1] === '}') {
                        const parts = imported.slice(1, -1).split(/\s*,\s*/);
                        for (const part of parts) {
                            const nameParts = part.split(/\s+as\s+/);
                            const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
                            const importName = nameParts[0].replace(/["']/g, '');
                            newCode += `__happy_dom_exports__['${exportName}'] = __happy_dom_imports__.get('${url}')?.['${importName}'];\n`;
                        }
                        imports.push(url);
                    }
                    skipCode = true;
                } else if (match[11]) {
                    // Export default statement
                    newCode +=
                        code.substring(lastIndex, match.index) + '__happy_dom_exports__.default = ';
                    skipCode = true;
                } else if (match[12] && match[13]) {
                    // Export function or class type
                    newCode +=
                        code.substring(lastIndex, match.index) +
                        `__happy_dom_exports__['${match[13]}'] = ${match[12]}`;
                    skipCode = true;
                } else if (match[14]) {
                    // Export object
                    newCode += code.substring(lastIndex, match.index);
                    const parts = match[14].split(/\s*,\s*/);
                    for (const part of parts) {
                        const nameParts = part.split(/\s+as\s+/);
                        const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
                        const importName = nameParts[0].replace(/["']/g, '');
                        newCode += `__happy_dom_exports__['${exportName}'] = ${importName};\n`;
                    }
                    skipCode = true;
                } else if (match[15]) {
                    // Export variable
                    if (match[17] === '=') {
                        const exportName = match[16].trim();
                        if (
                            (exportName[0] === '{' && exportName[exportName.length - 1] === '}') ||
                            (exportName[0] === '[' && exportName[exportName.length - 1] === ']')
                        ) {
                            newCode += code.substring(lastIndex, match.index);
                            const parts = match[16].split(/\s*,\s*/);
                            const variableObject: Map<string, string> = new Map();

                            for (const part of parts) {
                                const nameParts = part.split(/\s+:\s+/);
                                const exportName = (nameParts[1] || nameParts[0]).replace(/["']/g, '');
                                const importName = nameParts[0].replace(/["']/g, '');
                                variableObject.set(exportName, importName);
                            }

                            newCode += `const __happy_dom_variable_spread_${exportSpreadVariables.length}__ =`;
                            exportSpreadVariables.push(variableObject);
                        } else {
                            newCode +=
                                code.substring(lastIndex, match.index) +
                                `__happy_dom_exports__['${exportName}'] =`;
                        }
                    } else {
                        // TODO: If there is no =, we should ignore until we know what is is useful for
                        // Example: export let name1, name2, name3;
                        newCode +=
                            code.substring(lastIndex, match.index) + `/*Unknown export: ${match[0]}*/`;
                        this.window.console.warn(`Unknown export in "${moduleURL}": ${match[0]}`);
                    }
                    skipCode = true;
                }
            }
			}

			if (!skipCode) {
				newCode += code.substring(lastIndex, match.index + match[0].length);
			}

			skipCode = false;
			lastIndex = regExp.lastIndex;
		}

		if (exportSpreadVariables.length > 0) {
			for (let i = 0; i < exportSpreadVariables.length; i++) {
				for (const [exportName, importName] of exportSpreadVariables[i]) {
					newCode += `__happy_dom_exports__['${exportName}'] = __happy_dom_variable_spread_${i}__['${importName}'];\n`;
				}
			}
		}

		newCode += code.substring(lastIndex);

		return { imports, code: newCode };
	}
}
