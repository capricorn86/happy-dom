import HappyDOMSettingsMediaTypeEnum from './HappyDOMSettingsMediaTypeEnum';
import HappyDOMSettingsPrefersColorSchemeEnum from './HappyDOMSettingsPrefersColorSchemeEnum';

/**
 * Happy DOM settings.
 */
export default interface IHappyDOMSettings {
	disableJavaScriptEvaluation: boolean;
	disableJavaScriptFileLoading: boolean;
	disableCSSFileLoading: boolean;
	disableIframePageLoading: boolean;
	enableFileSystemHttpRequests: boolean;
	device: {
		prefersColorScheme: HappyDOMSettingsPrefersColorSchemeEnum;
		mediaType: HappyDOMSettingsMediaTypeEnum;
	};
}
