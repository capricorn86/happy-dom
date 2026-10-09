/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect } from 'vitest';
import ClassPrototypeEnumerability from '../../src/utilities/ClassPrototypeEnumerability.js';

describe('ClassPrototypeEnumerability', () => {
	describe('makeEnumerable()', () => {
		it('Makes methods declared on a class prototype enumerable.', () => {
			class Target {
				public method(): void {}
			}

			ClassPrototypeEnumerability.makeEnumerable(Target);

			expect(Target.prototype.propertyIsEnumerable('method')).toBe(true);
		});

		it('Makes accessors declared on a class prototype enumerable.', () => {
			class Target {
				public get property(): string {
					return 'value';
				}
			}

			ClassPrototypeEnumerability.makeEnumerable(Target);

			expect(Target.prototype.propertyIsEnumerable('property')).toBe(true);
		});

		it('Makes members of a source class enumerable on the target class prototype.', () => {
			class Source {
				public method(): void {}
			}

			class Target extends Source {}

			ClassPrototypeEnumerability.makeEnumerable(Target, Source);

			expect(Target.prototype.propertyIsEnumerable('method')).toBe(true);
		});

		it('Does not make the constructor enumerable.', () => {
			class Target {}

			ClassPrototypeEnumerability.makeEnumerable(Target);

			expect(Target.prototype.propertyIsEnumerable('constructor')).toBe(false);
		});
	});
});
