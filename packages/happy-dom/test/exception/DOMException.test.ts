import DOMException from '../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum';
import { describe, it, expect } from 'vitest';

describe('DOMException', () => {
	describe('get code()', () => {
		it('Returns the legacy code listed for the name.', () => {
			expect(new DOMException('Timed out.', DOMExceptionNameEnum.timeoutError).code).toBe(23);
			expect(new DOMException('Not found.', DOMExceptionNameEnum.notFoundError).code).toBe(8);
			expect(new DOMException('Aborted.', DOMExceptionNameEnum.abortError).code).toBe(20);
		});

		it('Returns 0 for a name with no entry in the table.', () => {
			expect(new DOMException('Unknown.', DOMExceptionNameEnum.unknownError).code).toBe(0);
			expect(new DOMException('Something.', 'NotAName').code).toBe(0);
		});

		it('Returns 0 when no name is given.', () => {
			expect(new DOMException('Something.').code).toBe(0);
		});

		it('Is exposed on the instance.', () => {
			expect('code' in new DOMException('Timed out.', DOMExceptionNameEnum.timeoutError)).toBe(
				true
			);
		});
	});
});
