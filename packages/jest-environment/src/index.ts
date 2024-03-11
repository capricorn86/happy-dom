/* eslint-disable filenames/match-exported */

import VM from 'vm';
import * as JestUtil from 'jest-util';
import { ModuleMocker } from 'jest-mock';
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers';
import { JestEnvironment, EnvironmentContext } from '@jest/environment';
import { Window, IWindow, BrowserErrorCaptureEnum, IOptionalBrowserSettings } from 'happy-dom';
import { Script } from 'vm';
import { Global, Config } from '@jest/types';

/**
 * Happy DOM Jest Environment.
 */
export default class HappyDOMEnvironment implements JestEnvironment {
	public fakeTimers: LegacyFakeTimers<number> = null;
	public fakeTimersModern: ModernFakeTimers = null;
	public window: IWindow;
	public global: Global.Global;
	public moduleMocker: ModuleMocker;

	/**
	 * Constructor.
	 *
	 * @param config Jest config.
	 * @param config.globalConfig jest global config.
	 * @param config.projectConfig jest project config.
	 * @param options Options.
	 */
	constructor(
		config:
			| { globalConfig: Config.GlobalConfig; projectConfig: Config.ProjectConfig }
			| Config.ProjectConfig,
		options?: EnvironmentContext
	) {
		let projectConfig: Config.ProjectConfig;
		let globals: Config.ConfigGlobals;
		if (isJestConfigVersion29(config)) {
			// Jest 29
			globals = config.globals;
			projectConfig = config;
		} else if (isJestConfigVersion28(config)) {
			// Jest < 29
			globals = config.projectConfig.globals;
			projectConfig = config.projectConfig;
		} else {
			throw new Error('Unsupported jest version.');
		}

		// Initialize Window and Global
		this.window = new Window({
			url: 'http://localhost/',
			...projectConfig.testEnvironmentOptions,
			console: options.console,
			settings: {
				...(<IOptionalBrowserSettings>projectConfig.testEnvironmentOptions?.settings),
				errorCapture: BrowserErrorCaptureEnum.disabled
			}
		});
		this.global = <Global.Global>(<unknown>this.window);
		this.moduleMocker = new ModuleMocker(<typeof globalThis>(<unknown>this.window));

		// Node's error-message stack size is limited to 10, but it's pretty useful to see more than that when a test fails.
		this.global.Error.stackTraceLimit = 100;

		// TODO: Remove this ASAP as it currently causes tests to run really slow.
		this.global.Buffer = Buffer;

		// Needed as Jest is using it
		this.window['global'] = this.global;

		JestUtil.installCommonGlobals(<typeof globalThis>(<unknown>this.window), globals);

		// For some reason Jest removes the global setImmediate, so we need to add it back.
		this.global.setImmediate = global.setImmediate;

		if (options && options.console) {
			this.global.console = options.console;
			this.global.window['console'] = options.console;
		}

		this.fakeTimers = new LegacyFakeTimers({
			config: projectConfig,
			global: <typeof globalThis>(<unknown>this.window),
			moduleMocker: this.moduleMocker,
			timerConfig: {
				idToRef: (id: number) => id,
				refToId: (ref: number) => ref
			}
		});

		this.fakeTimersModern = new ModernFakeTimers({
			config: projectConfig,
			global: <typeof globalThis>(<unknown>this.window)
		});

		// Jest is using the setTimeout function from Happy DOM internally for detecting when a test times out, but this causes window.happyDOM?.waitUntilComplete() and window.happyDOM?.abort() to not work as expected.
		// Hopefully Jest can fix this in the future as this fix is not very pretty.
		const happyDOMSetTimeout = this.global.setTimeout;
		(<(...args: unknown[]) => number>this.global.setTimeout) = (...args: unknown[]): number => {
			if (new Error('stack').stack.includes('/jest-jasmine')) {
				return global.setTimeout.call(global, ...args);
			}
			return happyDOMSetTimeout.call(this.global, ...args);
		};
	}

	/**
	 * Setup.
	 *
	 * @returns Promise.
	 */
	public async setup(): Promise<void> {}

	/**
	 * Teardown.
	 *
	 * @returns Promise.
	 */
	public async teardown(): Promise<void> {
		this.fakeTimers.dispose();
		this.fakeTimersModern.dispose();

		await (<IWindow>(<unknown>this.global)).happyDOM.abort();
		(<IWindow>(<unknown>this.global)).close();

		this.global = null;
		this.moduleMocker = null;
		this.fakeTimers = null;
		this.fakeTimersModern = null;
	}

	/**
	 * Runs a script.
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	public runScript(script: Script): null {
		return script.runInContext(this.global);
	}

	/**
	 * Returns the VM context.
	 *
	 * @returns Context.
	 */
	public getVmContext(): VM.Context {
		return this.global;
	}
}

function isJestConfigVersion29(config: unknown): config is Config.ProjectConfig {
	return Object.getOwnPropertyDescriptor(config, 'globals') !== undefined;
}

function isJestConfigVersion28(
	config: unknown
): config is { globalConfig: Config.GlobalConfig; projectConfig: Config.ProjectConfig } {
	return Object.getOwnPropertyDescriptor(config, 'projectConfig') !== undefined;
}
