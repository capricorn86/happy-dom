import PermissionStatus from './PermissionStatus.js';

/**
 * Permissions API.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Permissions.
 */
export default class Permissions {
	/**
	 * Returns scroll restoration.
	 *
	 * @param permissionDescriptor Permission descriptor.
	 * @param permissionDescriptor.name Permission name.
	 * @param [permissionDescriptor.userVisibleOnly] User visible only.
	 * @param [permissionDescriptor.sysex] Sysex.
	 * @returns Permission status.
	 */
	public async query(permissionDescriptor: {
		name: string;
		userVisibleOnly?: boolean;
		sysex?: boolean;
	}): Promise<PermissionStatus> {
		switch (permissionDescriptor.name) {
			case 'geolocation':
			case 'notifications':
			case 'push':
			case 'midi':
			case 'camera':
			case 'microphone':
			case 'background-fetch':
			case 'background-sync':
			case 'persistent-storage':
			case 'ambient-light-sensor':
			case 'accelerometer':
			case 'gyroscope':
			case 'magnetometer':
			case 'screen-wake-lock':
			case 'nfc':
			case 'display-capture':
			case 'accessibility-events':
			case 'clipboard-read':
			case 'clipboard-write':
			case 'payment-handler':
			case 'idle-detection':
			case 'periodic-background-sync':
			case 'system-wake-lock':
			case 'storage-access':
			case 'window-management':
			case 'window-placement':
			case 'local-fonts':
			case 'top-level-storage-access':
				return new PermissionStatus('granted');
		}

		throw new Error(
			`Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value '${permissionDescriptor.name}' is not a valid enum value of type PermissionName.`
		);
	}
}
