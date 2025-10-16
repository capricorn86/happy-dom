import HelpPrinterRows from './HelpPrinterRows.js';

/* eslint-disable no-console */

/**
 * CLI help printer.
 */
export default class HelpPrinter {
	/**
	 * Prints help information.
	 */
	public static print(): void {
		console.log('Happy DOM Server Renderer');
		console.log('========================');
		console.log('');
		console.log('Usage: happy-dom-sr [options]');
		console.log('');
		console.log('Options:');
		console.log('');

		// Calculate column widths
		const colWidths = [0, 0, 0, 0, 0];
		for (const row of HelpPrinterRows) {
			for (let i = 0; i < row.length; i++) {
				colWidths[i] = Math.max(colWidths[i], row[i].length);
			}
		}

		// Print table
		for (const row of HelpPrinterRows) {
			console.log('| ' + row.map((cell, i) => cell.padEnd(colWidths[i])).join(' | ') + ' |');
		}

		console.log('');
	}
}
