import { describe, it, expect, beforeEach, vi } from 'vitest';
import Window from '../../src/window/Window.js';
import ModuleURLUtility from '../../src/module/ModuleURLUtility.js';
import FS from 'fs';

describe('ModuleURLUtility', () => {
	beforeEach(() => {
		ModuleURLUtility.clearCache();
	});

	describe('getURL()', () => {
		it('Returns URL relative to parent module', () => {
			const window = new Window();

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', './module.js').href
			).toBe('http://localhost/scripts/module.js');

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', '../module.js').href
			).toBe('http://localhost/module.js');

			expect(
				ModuleURLUtility.getURL(
					window,
					'http://localhost/scripts/app.js',
					'http://localhost/scripts/module/module.js'
				).href
			).toBe('http://localhost/scripts/module/module.js');
		});

		it('Handles URL resolver defined in settings.module.urlResolver', () => {
			const window = new Window({
				settings: {
					module: {
						urlResolver: ({ url, parentURL }) => {
							if (url === './module.js' && parentURL === 'http://localhost/scripts/app.js') {
								return 'http://cdn.example.com/module.js';
							}
							return url;
						}
					}
				}
			});

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', './module.js').href
			).toBe('http://cdn.example.com/module.js');

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', './other.js').href
			).toBe('http://localhost/scripts/other.js');
		});

		it('Handles URL resolver defined in "settings.module.urlResolver"', () => {
			const window = new Window({
				settings: {
					module: {
						urlResolver: ({ url, parentURL }) => {
							if (url === './module.js' && parentURL === 'http://localhost/scripts/app.js') {
								return 'http://cdn.example.com/module.js';
							}
							return url;
						}
					}
				}
			});

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', './module.js').href
			).toBe('http://cdn.example.com/module.js');

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', './other.js').href
			).toBe('http://localhost/scripts/other.js');
		});

		for (const mainField of ['module', 'main']) {
			it(`Resolves "${mainField}" field in Node module URL when "settings.module.resolveNodeModules" is enabled`, () => {
				const window = new Window({
					settings: {
						module: {
							resolveNodeModules: {
								directory: './node_modules',
								url: 'http://localhost/node_modules/'
							}
						}
					}
				});

				vi.spyOn(FS, 'readFileSync').mockImplementation((path: any, encoding?: any): any => {
					if (path.endsWith('left-pad/package.json') && encoding === 'utf-8') {
						return JSON.stringify({ [mainField]: './lib/index.js' });
					}
					if (path.endsWith('@org/right-pad/package.json') && encoding === 'utf-8') {
						return JSON.stringify({ [mainField]: 'index.js' });
					}
					throw new Error('File not found');
				});

				vi.spyOn(FS, 'existsSync').mockImplementation((path: any): any => {
					if (path.endsWith('left-pad/lib/index.js')) {
						return true;
					}
					if (path.endsWith('@org/right-pad/index.js')) {
						return true;
					}
					return false;
				});

				expect(
					ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', 'left-pad').href
				).toBe('http://localhost/node_modules/left-pad/lib/index.js');

				expect(
					ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', '@org/right-pad').href
				).toBe('http://localhost/node_modules/@org/right-pad/index.js');
			});
		}

		it('Resolves export "." field in Node module URL when "settings.module.resolveNodeModules" is enabled', () => {
			const window = new Window({
				settings: {
					module: {
						resolveNodeModules: {
							directory: './node_modules',
							url: 'http://localhost/node_modules/'
						}
					}
				}
			});

			vi.spyOn(FS, 'readFileSync').mockImplementation((path: any, encoding?: any): any => {
				if (path.endsWith('left-pad/package.json') && encoding === 'utf-8') {
					return JSON.stringify({ exports: { '.': { import: './lib/index.js' } } });
				}
				if (path.endsWith('@org/right-pad/package.json') && encoding === 'utf-8') {
					return JSON.stringify({ exports: { '.': { import: 'index.js' } } });
				}
				throw new Error('File not found');
			});

			vi.spyOn(FS, 'existsSync').mockImplementation((path: any): any => {
				if (path.endsWith('left-pad/lib/index.js')) {
					return true;
				}
				if (path.endsWith('@org/right-pad/index.js')) {
					return true;
				}
				return false;
			});

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', 'left-pad').href
			).toBe('http://localhost/node_modules/left-pad/lib/index.js');

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', '@org/right-pad').href
			).toBe('http://localhost/node_modules/@org/right-pad/index.js');
		});

		it('Resolves export "*.js" field in Node module URL when "settings.module.resolveNodeModules" is enabled', () => {
			const window = new Window({
				settings: {
					module: {
						resolveNodeModules: {
							directory: './node_modules',
							url: 'http://localhost/node_modules/'
						}
					}
				}
			});

			vi.spyOn(FS, 'readFileSync').mockImplementation((path: any, encoding?: any): any => {
				if (path.endsWith('left-pad/package.json') && encoding === 'utf-8') {
					return JSON.stringify({ exports: { './lib/*.js': { import: './dist/*.js' } } });
				}
				if (path.endsWith('@org/right-pad/package.json') && encoding === 'utf-8') {
					return JSON.stringify({ exports: { '*.js': { import: 'lib/*.js' } } });
				}
				throw new Error('File not found');
			});

			vi.spyOn(FS, 'existsSync').mockImplementation((path: any): any => {
				if (path.endsWith('left-pad/dist/index.js')) {
					return true;
				}
				if (path.endsWith('@org/right-pad/index.js')) {
					return true;
				}
				return false;
			});

			expect(
				ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', 'left-pad/lib/index.js')
					.href
			).toBe('http://localhost/node_modules/left-pad/dist/index.js');

			expect(
				ModuleURLUtility.getURL(
					window,
					'http://localhost/scripts/app.js',
					'@org/right-pad/index.js'
				).href
			).toBe('http://localhost/node_modules/@org/right-pad/lib/index.js');
		});

		for (const extension of ['.js', '.mjs']) {
			it(`Appends "${extension}" for Node module URL when "settings.module.resolveNodeModules" is enabled`, () => {
				const window = new Window({
					settings: {
						module: {
							resolveNodeModules: {
								directory: './node_modules',
								url: 'http://localhost/node_modules/'
							}
						}
					}
				});

				vi.spyOn(FS, 'readFileSync').mockImplementation((path: any, encoding?: any): any => {
					if (path.endsWith('left-pad/package.json') && encoding === 'utf-8') {
						return JSON.stringify({});
					}
					if (path.endsWith('@org/right-pad/package.json') && encoding === 'utf-8') {
						return JSON.stringify({});
					}
					throw new Error('File not found');
				});

				vi.spyOn(FS, 'existsSync').mockImplementation((path: any): any => {
					if (path.endsWith(`left-pad/lib/index${extension}`)) {
						return true;
					}
					if (path.endsWith(`@org/right-pad/index${extension}`)) {
						return true;
					}
					return false;
				});

				expect(
					ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', 'left-pad/lib/index')
						.href
				).toBe(`http://localhost/node_modules/left-pad/lib/index${extension}`);

				expect(
					ModuleURLUtility.getURL(window, 'http://localhost/scripts/app.js', '@org/right-pad/index')
						.href
				).toBe(`http://localhost/node_modules/@org/right-pad/index${extension}`);
			});
		}
	});
});
