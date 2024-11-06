/* eslint-disable filenames/match-exported */

import VM from 'vm';
import * as JestUtil from 'jest-util';
import { ModuleMocker } from 'jest-mock';
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers';
import { JestEnvironment, EnvironmentContext } from '@jest/environment';
import { Window, BrowserErrorCaptureEnum, IOptionalBrowserSettings } from 'happy-dom';
import { Script } from 'vm';
import { Global, Config } from '@jest/types';

/**
 * Happy DOM Jest Environment.
 */
export default class HappyDOMEnvironment implements JestEnvironment {
	public fakeTimers: LegacyFakeTimers<number> = null;
	public fakeTimersModern: ModernFakeTimers = null;
	public window: Window;
	public global: Global.Global;
	public moduleMocker: ModuleMocker;

	/**
	 * jest-environment-jsdom" has the default set to ['browser']
	 * As changing this value would be a breaking change, we will keep it at ['node', 'node-addons'] until we do a major release
	 *
	 * @see https://stackoverflow.com/questions/72428323/jest-referenceerror-vue-is-not-defined
	 */
	public customExportConditions = ['node', 'node-addons'];

	private _configuredExportConditions: string[];

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

		if ('customExportConditions' in projectConfig.testEnvironmentOptions) {
			const { customExportConditions } = projectConfig.testEnvironmentOptions;
			if (
				Array.isArray(customExportConditions) &&
				customExportConditions.every((condition) => typeof condition === 'string')
			) {
				this._configuredExportConditions = customExportConditions;
			} else {
				throw new Error('Custom export conditions specified but they are not an array of strings');
			}
		}

		// Initialize Window and Global
		this.window = new Window({
			url: 'http://localhost/',
			...projectConfig.testEnvironmentOptions,
			console: options.console || console,
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
	 * Respect any export conditions specified as options
	 * https://jestjs.io/docs/configuration#testenvironmentoptions-object
	 */
	public exportConditions(): string[] {
		return this._configuredExportConditions ?? this.customExportConditions;
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

		await (<Window>(<unknown>this.global)).happyDOM.abort();
		(<Window>(<unknown>this.global)).close();

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
