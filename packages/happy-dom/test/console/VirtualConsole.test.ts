import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import VirtualConsole from '../../src/console/VirtualConsole.js';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter.js';

const ERROR_WITH_SIMPLE_STACK = new Error('Test error');
ERROR_WITH_SIMPLE_STACK.stack = 'Error: Test error\n    at /some/where.js:1:1';

describe('VirtualConsole', () => {
	let virtualConsolePrinter: VirtualConsolePrinter;
	let virtualConsole: VirtualConsole;

	beforeEach(() => {
		virtualConsolePrinter = new VirtualConsolePrinter();
		virtualConsole = new VirtualConsole(virtualConsolePrinter);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('assert()', () => {
		it('Should print a message if the assertion is false.', () => {
			virtualConsole.assert(false, 'Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Assertion failed: Test {"test":true}\n');
		});

		it('Should not print a message if the assertion is true.', () => {
			virtualConsole.assert(true, 'Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('');
		});
	});

	describe('clear()', () => {
		it('Should clear the console.', () => {
			virtualConsole.log('Test');
			virtualConsole.clear();
			expect(virtualConsolePrinter.readAsString()).toBe('');
		});
	});

	describe('count()', () => {
		it('Should print the number of times count() has been called.', () => {
			virtualConsole.count();
			virtualConsole.count();
			expect(virtualConsolePrinter.readAsString()).toBe('default: 1\ndefault: 2\n');
		});

		it('Should print the number of times count() has been called with a label.', () => {
			virtualConsole.count('test');
			virtualConsole.count('test');
			expect(virtualConsolePrinter.readAsString()).toBe('test: 1\ntest: 2\n');
		});
	});

	describe('countReset()', () => {
		it('Should reset the counter.', () => {
			virtualConsole.count();
			virtualConsole.countReset();
			virtualConsole.count();
			expect(virtualConsolePrinter.readAsString()).toBe('default: 1\ndefault: 0\ndefault: 1\n');
		});

		it('Should reset the counter with a label.', () => {
			virtualConsole.count('test');
			virtualConsole.countReset('test');
			virtualConsole.count('test');
			expect(virtualConsolePrinter.readAsString()).toBe('test: 1\ntest: 0\ntest: 1\n');
		});
	});

	describe('debug()', () => {
		it('Should print a message.', () => {
			virtualConsole.debug('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});
	});

	describe('dir()', () => {
		it('Should print an object.', () => {
			virtualConsole.dir({ test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('{"test":true}\n');
		});
	});

	describe('dirxml()', () => {
		it('Should print an object.', () => {
			virtualConsole.dirxml({ test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('{"test":true}\n');
		});
	});

	describe('error()', () => {
		it('Should print a message.', () => {
			virtualConsole.error('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});

		it('Should print an Error object.', () => {
			virtualConsole.error(ERROR_WITH_SIMPLE_STACK);
			expect(virtualConsolePrinter.readAsString()).toBe(
				'Error: Test error\n    at /some/where.js:1:1\n'
			);
		});
	});

	describe('exception()', () => {
		it('Should print a message.', () => {
			virtualConsole.exception('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});

		it('Should print an Error object.', () => {
			virtualConsole.exception(ERROR_WITH_SIMPLE_STACK);
			expect(virtualConsolePrinter.readAsString()).toBe(
				'Error: Test error\n    at /some/where.js:1:1\n'
			);
		});
	});

	describe('group()', () => {
		it('Should create groups.', () => {
			virtualConsole.group('Group 1');
			virtualConsole.log('Test 1');
			virtualConsole.log('Test 2');
			virtualConsole.group('Group 2');
			virtualConsole.log('Test 3');
			virtualConsole.groupEnd();
			virtualConsole.log('Test 4');
			virtualConsole.groupEnd();
			expect(virtualConsolePrinter.readAsString()).toBe(
				'▼ Group 1\n' +
					'  Test 1\n' +
					'  Test 2\n' +
					'  ▼ Group 2\n' +
					'    Test 3\n' +
					'  Test 4\n'
			);
		});

		it('Should handle a default group.', () => {
			virtualConsole.log('Test 1');
			virtualConsole.group();
			virtualConsole.log('Test 2');
			virtualConsole.groupEnd();
			virtualConsole.log('Test 3');
			expect(virtualConsolePrinter.readAsString()).toBe(
				'Test 1\n' + '▼ default\n' + '  Test 2\n' + 'Test 3\n'
			);
		});
	});

	describe('groupCollapsed()', () => {
		it('Should create groups collapsed.', () => {
			virtualConsole.groupCollapsed('Group 1');
			virtualConsole.log('Test 1');
			virtualConsole.log('Test 2');
			virtualConsole.groupCollapsed('Group 2');
			virtualConsole.log('Test 3');
			virtualConsole.groupEnd();
			virtualConsole.groupEnd();
			virtualConsole.group('Group 3');
			virtualConsole.log('Test 4');
			expect(virtualConsolePrinter.readAsString()).toBe(
				'▶ Group 1\n' + '▼ Group 3\n' + '  Test 4\n'
			);
		});

		it('Should handle a default group.', () => {
			virtualConsole.log('Test 1');
			virtualConsole.groupCollapsed();
			virtualConsole.log('Test 2');
			virtualConsole.groupEnd();
			virtualConsole.log('Test 3');
			expect(virtualConsolePrinter.readAsString()).toBe('Test 1\n' + '▶ default\n' + 'Test 3\n');
		});
	});

	describe('groupEnd()', () => {
		it('Should exit the current group.', () => {
			virtualConsole.group('Group 1');
			virtualConsole.log('Test 1');
			virtualConsole.groupCollapsed('Group 2');
			virtualConsole.log('Test 2');
			virtualConsole.groupEnd();
			virtualConsole.log('Test 3');
			virtualConsole.groupEnd();
			expect(virtualConsolePrinter.readAsString()).toBe(
				'▼ Group 1\n' + '  Test 1\n' + '  ▶ Group 2\n' + '  Test 3\n'
			);
		});
	});

	describe('info()', () => {
		it('Should print a message.', () => {
			virtualConsole.info('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});
	});

	describe('log()', () => {
		it('Should print a message.', () => {
			virtualConsole.log('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});
	});

	describe('profile()', () => {
		it('Should throw an exception that it is not supported.', () => {
			expect(() => virtualConsole.profile()).toThrow('Method not implemented.');
		});
	});

	describe('profileEnd()', () => {
		it('Should throw an exception that it is not supported.', () => {
			expect(() => virtualConsole.profileEnd()).toThrow('Method not implemented.');
		});
	});

	describe('table()', () => {
		it('Should print an object.', () => {
			virtualConsole.table({ a: 1 });
			expect(virtualConsolePrinter.readAsString()).toBe('{"a":1}\n');
		});
	});

	describe('time()', () => {
		it('Should store time for the default label.', () => {
			let performanceNow = 12345;
			vi.spyOn(performance, 'now').mockImplementation(() => performanceNow++);
			virtualConsole.time();
			virtualConsole.timeEnd();
			expect(virtualConsolePrinter.readAsString()).toBe('default: 1ms - timer ended\n');
		});

		it('Should store time for a label.', () => {
			let performanceNow = 12345;
			vi.spyOn(performance, 'now').mockImplementation(() => performanceNow++);
			virtualConsole.time('test');
			virtualConsole.timeEnd('test');
			expect(virtualConsolePrinter.readAsString()).toBe('test: 1ms - timer ended\n');
		});
	});

	describe('timeEnd()', () => {
		it('Should print the time between the stored start time and when it was ended.', () => {
			let performanceNow = 12345;
			vi.spyOn(performance, 'now').mockImplementation(() => performanceNow++);
			virtualConsole.time();
			virtualConsole.timeEnd();
			expect(virtualConsolePrinter.readAsString()).toBe('default: 1ms - timer ended\n');
		});
	});

	describe('timeLog()', () => {
		it('Should print the time between the stored start time and when it was ended.', () => {
			let performanceNow = 12345;
			vi.spyOn(performance, 'now').mockImplementation(() => performanceNow++);
			virtualConsole.time();
			virtualConsole.timeLog();
			expect(virtualConsolePrinter.readAsString()).toMatch('default: 1ms');
		});

		it('Should print the time between the stored start time and when it was ended with a label.', () => {
			let performanceNow = 12345;
			vi.spyOn(performance, 'now').mockImplementation(() => performanceNow++);
			virtualConsole.time('test');
			virtualConsole.timeLog('test');
			expect(virtualConsolePrinter.readAsString()).toMatch('test: 1ms');
		});
	});

	describe('timeStamp()', () => {
		it('Should throw an exception that it is not supported.', () => {
			expect(() => virtualConsole.timeStamp()).toThrow('Method not implemented.');
		});
	});

	describe('trace()', () => {
		it('Should print a stack trace.', () => {
			virtualConsole.trace('Test', { test: true });
			expect(virtualConsolePrinter.readAsString().startsWith('Test {"test":true} \n    at')).toBe(
				true
			);
		});
	});

	describe('warn()', () => {
		it('Should print a message.', () => {
			virtualConsole.warn('Test', { test: true });
			expect(virtualConsolePrinter.readAsString()).toBe('Test {"test":true}\n');
		});
	});
});
