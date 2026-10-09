import { createContext, type Context } from 'vm';
import { describe, it, expect } from 'vitest';
import VMGlobalPropertyScript from '../../src/window/VMGlobalPropertyScript.js';

describe('VMGlobalPropertyScript', () => {
	it('Populates globals from the VM context when globalThis is defined on the window.', () => {
		const context: Context = {
			globalThis: {}
		};

		createContext(context);
		VMGlobalPropertyScript.runInContext(context);

		expect(typeof context.Object).toBe('function');
		expect(typeof context.Function).toBe('function');
		expect(typeof context.Array).toBe('function');
		expect(typeof context.Error).toBe('function');
		expect(typeof context.SyntaxError).toBe('function');
		expect(typeof context.TypeError).toBe('function');
		expect(context.Object).not.toBe(globalThis.Object);
		expect(context.Function).not.toBe(globalThis.Function);
		expect(context.Array).not.toBe(globalThis.Array);
	});
});
