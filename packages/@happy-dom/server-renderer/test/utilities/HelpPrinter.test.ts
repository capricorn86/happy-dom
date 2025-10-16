import { describe, it, expect, vi } from 'vitest';
import HelpPrinter from '../../src/utilities/HelpPrinter.js';

describe('HelpPrinter', () => {
	describe('print()', () => {
		it('Prints help to the console.', async () => {
			const log: string[] = [];
			vi.spyOn(console, 'log').mockImplementation((...args) => {
				log.push(args.join(' '));
			});
			HelpPrinter.print();
			expect(log[0]).toBe('Happy DOM Server Renderer');
		});
	});
});
