import type { Config } from '@jest/types';
import {
	BrowserErrorCaptureEnum,
	BrowserNavigationCrossOriginPolicyEnum,
	type IWindow
} from 'happy-dom';

export function parseEnvironmentOptions(
	testEnvironmentOptions: Config.ProjectConfig['testEnvironmentOptions'],
	happyDOM: IWindow['happyDOM']
): void {
	for (const [key, value] of Object.entries(testEnvironmentOptions)) {
		switch (key) {
			case 'disableJavaScriptEvaluation':
			case 'disableJavaScriptFileLoading':
			case 'disableCSSFileLoading':
			case 'disableComputedStyleRendering': {
				setValue('boolean', 'testEnvironmentOptions', happyDOM.settings, key, value);
				break;
			}
			case 'errorCapture': {
				const errorCaptureValidOptions: unknown[] = Object.values(BrowserErrorCaptureEnum);
				setEnumValue(
					errorCaptureValidOptions,
					'testEnvironmentOptions',
					happyDOM.settings,
					key,
					value
				);
				break;
			}
			case 'navigation': {
				parseNavigationOptions(happyDOM, testEnvironmentOptions.navigation);
				break;
			}
			case 'navigator': {
				parseNavigatorOptions(happyDOM, testEnvironmentOptions.navigator);
				break;
			}
			case 'device': {
				parseDeviceOptions(happyDOM, testEnvironmentOptions.device);
				break;
			}
			case 'url': {
				if (typeof value !== 'string') {
					throw new Error('testEnvironmentOptions.url must be a string');
				}
				happyDOM.setURL(value);
			}
		}
	}
}

function parseNavigationOptions(happyDOM: IWindow['happyDOM'], options: unknown): void {
	for (const [key, value] of Object.entries(options)) {
		switch (key) {
			case 'disableMainFrameNavigation':
			case 'disableChildFrameNavigation':
			case 'disableChildPageNavigation':
			case 'disableFallbackToSetURL': {
				setValue(
					'boolean',
					'testEnvironmentOptions.navigation',
					happyDOM.settings.navigation,
					key,
					value
				);
				break;
			}
			case 'crossOriginPolicy': {
				const browserNavigationCrossOriginPolicyOptions: unknown[] = Object.values(
					BrowserNavigationCrossOriginPolicyEnum
				);
				setEnumValue(
					browserNavigationCrossOriginPolicyOptions,
					'testEnvironmentOptions.navigation',
					happyDOM.settings.navigation,
					key,
					value
				);
				break;
			}
		}
	}
}

function parseNavigatorOptions(happyDOM: IWindow['happyDOM'], options: unknown): void {
	for (const [key, value] of Object.entries(options)) {
		switch (key) {
			case 'userAgent': {
				setValue(
					'string',
					'testEnvironmentOptions.navigator',
					happyDOM.settings.navigator,
					key,
					value
				);
				break;
			}
			case 'maxTouchPoints': {
				setValue(
					'number',
					'testEnvironmentOptions.navigator',
					happyDOM.settings.navigator,
					key,
					value
				);
				break;
			}
		}
	}
}

function parseDeviceOptions(happyDOM: IWindow['happyDOM'], options: unknown): void {
	for (const [key, value] of Object.entries(options)) {
		switch (key) {
			case 'prefersColorScheme': {
				setValue('string', 'testEnvironmentOptions.device', happyDOM.settings.device, key, value);
				break;
			}
			case 'mediaType': {
				setValue('string', 'testEnvironmentOptions.device', happyDOM.settings.device, key, value);
				break;
			}
		}
	}
}

function setValue<T, U extends keyof T>(
	type: 'string' | 'number' | 'boolean',
	path: string,
	target: T,
	key: U,
	value: unknown
): void {
	if (typeof value !== type) {
		throw new Error(`${path}.${key.toString()} must be a ${type}`);
	}
	target[key] = <T[U]>value;
}

function setEnumValue<T, U extends keyof T>(
	enumValues: unknown[],
	path: string,
	target: T,
	key: U,
	value: unknown
): void {
	if (!enumValues.includes(value)) {
		throw new Error(`${path}.${key.toString()} must be one of ${enumValues.join(', ')}`);
	}
	target[key] = <T[U]>value;
}
