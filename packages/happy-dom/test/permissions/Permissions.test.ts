import Window from '../../src/window/Window.js';
import PermissionNameEnum from '../../src/permissions/PermissionNameEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('Permissions', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('queue()', () => {
		for (const permissionName of Object.values(PermissionNameEnum)) {
			it(`Reads permissions for ${permissionName}.`, async () => {
				const permissionStatus = await window.navigator.permissions.query({
					name: permissionName
				});
				expect(permissionStatus).toBeInstanceOf(window.PermissionStatus);
				expect(permissionStatus.state).toBe('granted');
				const permissionStatus2 = await window.navigator.permissions.query({
					name: permissionName
				});
				expect(permissionStatus2).toBe(permissionStatus);
			});
		}

		it('Throws an error for unsupported permission names.', async () => {
			let error: Error | null = null;
			try {
				await window.navigator.permissions.query({
					name: 'test'
				});
			} catch (e) {
				error = e;
			}
			expect(error?.message).toBe(
				"Failed to execute 'query' on 'Permissions': Failed to read the 'name' property from 'PermissionDescriptor': The provided value 'test' is not a valid enum value of type PermissionName."
			);
		});
	});
});
