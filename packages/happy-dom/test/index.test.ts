import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import HTMLElementConfig from '../src/config/HTMLElementConfig.js';
import * as Index from '../src/index.js';

describe('Index', () => {
	for (const tagName of Object.keys(HTMLElementConfig)) {
		it(`Exposes the element class "${HTMLElementConfig[tagName].className}" for tag name "${tagName}"`, () => {
			expect(Index[HTMLElementConfig[tagName].className].name).toBe(
				HTMLElementConfig[tagName].className
			);
		});
	}
});
