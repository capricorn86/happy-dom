import { describe, it, expect } from 'vitest';
import CSSPropertyManager from '../../../../src/css/declaration/property-manager/CSSPropertyManager.js';

describe('CSSPropertyManager', () => {
	describe('clone()', () => {
		it('Returns a copy with the same properties.', () => {
			const propertyManager = new CSSPropertyManager({
				cssText:
					'margin: 1px 2px; color: red !important; --main-color: blue; font: italic bold 12px/30px Georgia, serif'
			});
			const clone = propertyManager.clone();

			expect(clone).not.toBe(propertyManager);
			expect(clone.properties).toEqual(propertyManager.properties);
			expect(Object.keys(clone.properties)).toEqual(Object.keys(propertyManager.properties));
			expect(clone.toString()).toBe(propertyManager.toString());
		});

		it('Returns a copy that does not share property values with the original.', () => {
			const propertyManager = new CSSPropertyManager({
				cssText: 'color: red; margin-top: 1px'
			});
			const clone = propertyManager.clone();

			clone.get('color')!.value = 'blue';
			clone.set('margin-top', '2px', true);
			clone.remove('color');

			expect(propertyManager.get('color')).toEqual({ value: 'red', important: false });
			expect(propertyManager.get('margin-top')).toEqual({ value: '1px', important: false });
			expect(propertyManager.toString()).toBe('color: red; margin-top: 1px;');
		});
	});
});
