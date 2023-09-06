import { beforeEach, describe, it, expect } from 'vitest';
import VirtualConsoleLogLevelEnum from '../../src/console/enums/VirtualConsoleLogLevelEnum.js';
import VirtualConsoleLogTypeEnum from '../../src/console/enums/VirtualConsoleLogTypeEnum.js';
import VirtualConsole from '../../src/console/VirtualConsole.js';
import VirtualConsolePrinter from '../../src/console/VirtualConsolePrinter.js';
import Event from '../../src/event/Event.js';

const ERROR_WITH_SIMPLE_STACK = new Error('Test error');
ERROR_WITH_SIMPLE_STACK.stack = 'Error: Test error\n    at /some/where.js:1:1';

describe('VirtualConsolePrinter', () => {
	let virtualConsolePrinter: VirtualConsolePrinter;
	let virtualConsole: VirtualConsole;

	beforeEach(() => {
		virtualConsolePrinter = new VirtualConsolePrinter();
		virtualConsole = new VirtualConsole(virtualConsolePrinter);
	});

	describe('print()', () => {
		it('Prints log entries.', () => {
			virtualConsolePrinter.print({
				type: VirtualConsoleLogTypeEnum.log,
				level: VirtualConsoleLogLevelEnum.log,
				message: ['Test 1', { test: 'test' }],
				group: null
			});

			virtualConsolePrinter.print({
				type: VirtualConsoleLogTypeEnum.info,
				level: VirtualConsoleLogLevelEnum.info,
				message: ['Test 2', { test: 'test' }],
				group: null
			});

			expect(virtualConsolePrinter.read()).toEqual([
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 1', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.info,
					level: VirtualConsoleLogLevelEnum.info,
					message: ['Test 2', { test: 'test' }],
					group: null
				}
			]);

			expect(virtualConsolePrinter.read()).toEqual([]);
		});
	});

	describe('clear()', () => {
		it('Clears the console.', () => {
			virtualConsolePrinter.print({
				type: VirtualConsoleLogTypeEnum.log,
				level: VirtualConsoleLogLevelEnum.log,
				message: ['Test 1', { test: 'test' }],
				group: null
			});

			virtualConsolePrinter.clear();

			expect(virtualConsolePrinter.read()).toEqual([]);
		});
	});

	describe('addEventListener()', () => {
		it('Adds an event listener for "print".', () => {
			let printEvent: Event | null = null;
			virtualConsolePrinter.addEventListener('print', (event) => (printEvent = <Event>event));

			virtualConsolePrinter.print({
				type: VirtualConsoleLogTypeEnum.log,
				level: VirtualConsoleLogLevelEnum.log,
				message: ['Test 1', { test: 'test' }],
				group: null
			});

			expect((<Event>(<unknown>printEvent)).type).toBe('print');
		});

		it('Adds an event listener for "clear".', () => {
			let printEvent: Event | null = null;
			virtualConsolePrinter.addEventListener('clear', (event) => (printEvent = <Event>event));

			virtualConsolePrinter.clear();

			expect((<Event>(<unknown>printEvent)).type).toBe('clear');
		});
	});

	describe('removeEventListener()', () => {
		it('Removes an event listener for "print".', () => {
			let printEvent: Event | null = null;
			const listener = (event: Event): Event => (printEvent = event);

			virtualConsolePrinter.addEventListener('print', listener);
			virtualConsolePrinter.removeEventListener('print', listener);

			virtualConsolePrinter.print({
				type: VirtualConsoleLogTypeEnum.log,
				level: VirtualConsoleLogLevelEnum.log,
				message: ['Test 1', { test: 'test' }],
				group: null
			});

			expect(printEvent).toBe(null);
		});

		it('Removes an event listener for "clear".', () => {
			let printEvent: Event | null = null;
			const listener = (event: Event): Event => (printEvent = event);

			virtualConsolePrinter.addEventListener('clear', listener);
			virtualConsolePrinter.removeEventListener('clear', listener);

			virtualConsolePrinter.clear();

			expect(printEvent).toBe(null);
		});
	});

	describe('dispatchEvent()', () => {
		it('Dispatches an event.', () => {
			let printEvent: Event | null = null;
			virtualConsolePrinter.addEventListener('print', (event) => (printEvent = <Event>event));

			virtualConsolePrinter.dispatchEvent(new Event('print'));

			expect((<Event>(<unknown>printEvent)).type).toBe('print');
		});
	});

	describe('read()', () => {
		it('Returns the buffered console output.', () => {
			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });
			virtualConsole.warn('Test 3', { test: 'test' });
			virtualConsole.error('Test 4', { test: 'test' }, new Error('Test error'));
			virtualConsole.debug('Test 5', { test: 'test' });
			virtualConsole.assert(false, 'Test 6', { test: 'test' });
			virtualConsole.group('Test 7');
			virtualConsole.log('Test 8', { test: 'test' });
			virtualConsole.groupCollapsed('Test 9');
			virtualConsole.log('Test 10', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.log('Test 11', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.count('Test 12');
			virtualConsole.count('Test 12');
			virtualConsole.countReset('Test 12');

			expect(virtualConsolePrinter?.read()).toEqual([
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 1', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.info,
					level: VirtualConsoleLogLevelEnum.info,
					message: ['Test 2', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.warn,
					level: VirtualConsoleLogLevelEnum.warn,
					message: ['Test 3', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.error,
					level: VirtualConsoleLogLevelEnum.error,
					message: ['Test 4', { test: 'test' }, new Error('Test error')],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.debug,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 5', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.assert,
					level: VirtualConsoleLogLevelEnum.error,
					message: ['Assertion failed:', 'Test 6', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.group,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 7'],
					group: {
						id: 1,
						label: 'Test 7',
						collapsed: false,
						parent: null
					}
				},
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 8', { test: 'test' }],
					group: {
						id: 1,
						label: 'Test 7',
						collapsed: false,
						parent: null
					}
				},
				{
					type: VirtualConsoleLogTypeEnum.groupCollapsed,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 9'],
					group: {
						id: 2,
						label: 'Test 9',
						collapsed: true,
						parent: {
							id: 1,
							label: 'Test 7',
							collapsed: false,
							parent: null
						}
					}
				},
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 10', { test: 'test' }],
					group: {
						id: 2,
						label: 'Test 9',
						collapsed: true,
						parent: {
							id: 1,
							label: 'Test 7',
							collapsed: false,
							parent: null
						}
					}
				},
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 11', { test: 'test' }],
					group: {
						id: 1,
						label: 'Test 7',
						collapsed: false,
						parent: null
					}
				},
				{
					type: VirtualConsoleLogTypeEnum.count,
					level: VirtualConsoleLogLevelEnum.info,
					message: ['Test 12: 1'],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.count,
					level: VirtualConsoleLogLevelEnum.info,
					message: ['Test 12: 2'],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.countReset,
					level: VirtualConsoleLogLevelEnum.warn,
					message: ['Test 12: 0'],
					group: null
				}
			]);

			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });

			expect(virtualConsolePrinter?.read()).toEqual([
				{
					type: VirtualConsoleLogTypeEnum.log,
					level: VirtualConsoleLogLevelEnum.log,
					message: ['Test 1', { test: 'test' }],
					group: null
				},
				{
					type: VirtualConsoleLogTypeEnum.info,
					level: VirtualConsoleLogLevelEnum.info,
					message: ['Test 2', { test: 'test' }],
					group: null
				}
			]);

			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });

			virtualConsole.clear();

			expect(virtualConsolePrinter?.read()).toEqual([]);
		});
	});

	describe('readAsString()', () => {
		it('Returns the buffered console output as a string with default log level ("log").', () => {
			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });
			virtualConsole.warn('Test 3', { test: 'test' });
			virtualConsole.error('Test 4', { test: 'test' }, ERROR_WITH_SIMPLE_STACK);
			virtualConsole.debug('Test 5', { test: 'test' });
			virtualConsole.assert(false, 'Test 6', { test: 'test' });
			virtualConsole.group('Test 7');
			virtualConsole.log('Test 8', { test: 'test' });
			virtualConsole.groupCollapsed('Test 9');
			virtualConsole.log('Test 10', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.group('Test 11');
			virtualConsole.log('Test 12', { test: 'test' });
			virtualConsole.error('Test 13', ERROR_WITH_SIMPLE_STACK);
			virtualConsole.groupEnd();
			virtualConsole.log('Test 14', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.count('Test 15');
			virtualConsole.count('Test 15');
			virtualConsole.countReset('Test 15');

			expect(virtualConsolePrinter?.readAsString()).toEqual(
				'Test 1 {"test":"test"}\n' +
					'Test 2 {"test":"test"}\n' +
					'Test 3 {"test":"test"}\n' +
					'Test 4 {"test":"test"} Error: Test error\n' +
					'    at /some/where.js:1:1\n' +
					'Test 5 {"test":"test"}\n' +
					'Assertion failed: Test 6 {"test":"test"}\n' +
					'▼ Test 7\n' +
					'  Test 8 {"test":"test"}\n' +
					'  ▶ Test 9\n' +
					'  ▼ Test 11\n' +
					'    Test 12 {"test":"test"}\n' +
					'    Test 13 Error: Test error\n' +
					'        at /some/where.js:1:1\n' +
					'  Test 14 {"test":"test"}\n' +
					'Test 15: 1\n' +
					'Test 15: 2\n' +
					'Test 15: 0\n'
			);

			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });

			expect(virtualConsolePrinter?.readAsString()).toEqual(
				'Test 1 {"test":"test"}\n' + 'Test 2 {"test":"test"}\n'
			);

			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });

			virtualConsole.clear();

			expect(virtualConsolePrinter?.readAsString()).toEqual('');
		});

		it('Returns the buffered console output as a string with log level "info".', () => {
			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });
			virtualConsole.warn('Test 3', { test: 'test' });
			virtualConsole.error('Test 4', { test: 'test' }, ERROR_WITH_SIMPLE_STACK);
			virtualConsole.debug('Test 5', { test: 'test' });
			virtualConsole.assert(false, 'Test 6', { test: 'test' });
			virtualConsole.group('Test 7');
			virtualConsole.log('Test 8', { test: 'test' });
			virtualConsole.groupCollapsed('Test 9');
			virtualConsole.log('Test 10', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.log('Test 11', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.count('Test 12');
			virtualConsole.count('Test 12');
			virtualConsole.countReset('Test 12');

			expect(virtualConsolePrinter?.readAsString(VirtualConsoleLogLevelEnum.info)).toEqual(
				'Test 2 {"test":"test"}\n' +
					'Test 3 {"test":"test"}\n' +
					'Test 4 {"test":"test"} Error: Test error\n' +
					'    at /some/where.js:1:1\n' +
					'Assertion failed: Test 6 {"test":"test"}\n' +
					'Test 12: 1\n' +
					'Test 12: 2\n' +
					'Test 12: 0\n'
			);
		});

		it('Returns the buffered console output as a string with log level "warn".', () => {
			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });
			virtualConsole.warn('Test 3', { test: 'test' });
			virtualConsole.error('Test 4', { test: 'test' }, ERROR_WITH_SIMPLE_STACK);
			virtualConsole.debug('Test 5', { test: 'test' });
			virtualConsole.assert(false, 'Test 6', { test: 'test' });
			virtualConsole.group('Test 7');
			virtualConsole.log('Test 8', { test: 'test' });
			virtualConsole.groupCollapsed('Test 9');
			virtualConsole.log('Test 10', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.log('Test 11', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.count('Test 12');
			virtualConsole.count('Test 12');
			virtualConsole.countReset('Test 12');

			expect(virtualConsolePrinter?.readAsString(VirtualConsoleLogLevelEnum.warn)).toEqual(
				'Test 3 {"test":"test"}\n' +
					'Test 4 {"test":"test"} Error: Test error\n' +
					'    at /some/where.js:1:1\n' +
					'Assertion failed: Test 6 {"test":"test"}\n' +
					'Test 12: 0\n'
			);
		});

		it('Returns the buffered console output as a string with log level "error".', () => {
			virtualConsole.log('Test 1', { test: 'test' });
			virtualConsole.info('Test 2', { test: 'test' });
			virtualConsole.warn('Test 3', { test: 'test' });
			virtualConsole.error('Test 4', { test: 'test' }, ERROR_WITH_SIMPLE_STACK);
			virtualConsole.debug('Test 5', { test: 'test' });
			virtualConsole.assert(false, 'Test 6', { test: 'test' });
			virtualConsole.group('Test 7');
			virtualConsole.log('Test 8', { test: 'test' });
			virtualConsole.groupCollapsed('Test 9');
			virtualConsole.log('Test 10', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.log('Test 11', { test: 'test' });
			virtualConsole.groupEnd();
			virtualConsole.count('Test 12');
			virtualConsole.count('Test 12');
			virtualConsole.countReset('Test 12');

			expect(virtualConsolePrinter?.readAsString(VirtualConsoleLogLevelEnum.error)).toEqual(
				'Test 4 {"test":"test"} Error: Test error\n' +
					'    at /some/where.js:1:1\n' +
					'Assertion failed: Test 6 {"test":"test"}\n'
			);
		});

		it("Handles objects that can't be serialized.", () => {
			const objectWithSelfReference = {};
			objectWithSelfReference['self'] = objectWithSelfReference;

			virtualConsole.log(objectWithSelfReference);

			expect(
				virtualConsolePrinter
					?.readAsString()
					.startsWith('Error: Failed to JSON stringify object in log entry.\n    at ')
			).toBe(true);
		});
	});
});
