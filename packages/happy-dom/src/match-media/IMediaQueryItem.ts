import MediaQueryDeviceEnum from './MediaQueryDeviceEnum';

/**
 * Media query item.
 */
export default interface IMediaQueryItem {
	device: MediaQueryDeviceEnum;
	not: boolean;
	rule: { key: string; value: string | null };
}
