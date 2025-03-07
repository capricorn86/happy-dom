import KeyboardEvent from '../../../src/event/events/KeyboardEvent.js';
import { describe, it, expect } from 'vitest';

describe('KeyboardEvent', () => {
	describe('getModifierState()', () => {
		it('Returns true when Alt key is pressed', () => {
			const event = new KeyboardEvent('keydown', { altKey: true });
			expect(event.getModifierState('Alt')).toBe(true);
			expect(event.getModifierState('AltGraph')).toBe(true);
		});

		it('Returns true when Control key is pressed', () => {
			const event = new KeyboardEvent('keydown', { ctrlKey: true });
			expect(event.getModifierState('Control')).toBe(true);
		});

		it('Returns true when Meta key is pressed', () => {
			const event = new KeyboardEvent('keydown', { metaKey: true });
			expect(event.getModifierState('Meta')).toBe(true);
		});

		it('Returns true when Shift key is pressed', () => {
			const event = new KeyboardEvent('keydown', { shiftKey: true });
			expect(event.getModifierState('Shift')).toBe(true);
		});

		it('Returns false when modifier keys are not pressed', () => {
			const event = new KeyboardEvent('keydown', {});
			expect(event.getModifierState('Alt')).toBe(false);
			expect(event.getModifierState('Control')).toBe(false);
			expect(event.getModifierState('Meta')).toBe(false);
			expect(event.getModifierState('Shift')).toBe(false);
		});

		it('Is case-insensitive for modifier key names', () => {
			const event = new KeyboardEvent('keydown', {
				altKey: true,
				ctrlKey: true,
				metaKey: true,
				shiftKey: true
			});
			expect(event.getModifierState('alt')).toBe(true);
			expect(event.getModifierState('CONTROL')).toBe(true);
			expect(event.getModifierState('Meta')).toBe(true);
			expect(event.getModifierState('ShIfT')).toBe(true);
		});

		it('Returns false for invalid modifier keys', () => {
			const event = new KeyboardEvent('keydown', {});
			expect(event.getModifierState('InvalidKey')).toBe(false);
			expect(event.getModifierState('')).toBe(false);
		});

		it('Ignores invalid types', () => {
			const event = new KeyboardEvent('keydown');
			expect(event.getModifierState(<string>(<unknown>false))).toBe(false);
			expect(event.getModifierState(<string>(<unknown>null))).toBe(false);
		});

		it('Throws an error when no arguments are passed', () => {
			const event = new KeyboardEvent('keydown');
			// @ts-expect-error
			expect(() => event.getModifierState()).toThrowError(
				new TypeError(
					"Failed to execute 'getModifierState' on 'KeyboardEvent': 1 argument required, but only 0 present."
				)
			);
		});
	});
});
