import { describe, it, expect, beforeEach } from 'vitest';
import VM from 'vm';
import Window from '../../src/window/Window.js';

describe('SubtleCryptoWrapper', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('importKey()', () => {
		it('Imports an Ed25519 public key from SPKI format', async () => {
			// Valid Ed25519 SPKI public key (44 bytes)
			const spkiKey = new Uint8Array([
				0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
				// 32 bytes of public key data
				0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
				0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e,
				0x1f, 0x20
			]);

			const key = await window.crypto.subtle.importKey('spki', spkiKey.buffer, 'Ed25519', true, [
				'verify'
			]);

			expect(key).toBeDefined();
			expect(key.type).toBe('public');
			expect(key.algorithm.name).toBe('Ed25519');
			expect(key.extractable).toBe(true);
			expect(key.usages).toContain('verify');
		});

		it('Imports a key from JWK format', async () => {
			const jwk = {
				kty: 'oct',
				k: 'Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE',
				alg: 'A256GCM',
				ext: true
			};

			const key = await window.crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM' }, true, [
				'encrypt',
				'decrypt'
			]);

			expect(key).toBeDefined();
			expect(key.type).toBe('secret');
			expect(key.algorithm.name).toBe('AES-GCM');
		});
	});

	describe('encrypt() and decrypt()', () => {
		it('Encrypts and decrypts data using AES-GCM', async () => {
			const key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
				'encrypt',
				'decrypt'
			]);

			const iv = window.crypto.getRandomValues(new Uint8Array(12));
			const data = new TextEncoder().encode('Hello, World!');

			const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

			expect(encrypted).toBeInstanceOf(ArrayBuffer);
			expect(encrypted.byteLength).toBeGreaterThan(data.byteLength);

			const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

			expect(new TextDecoder().decode(decrypted)).toBe('Hello, World!');
		});
	});

	describe('sign() and verify()', () => {
		it('Signs and verifies data using HMAC', async () => {
			const key = await window.crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, true, [
				'sign',
				'verify'
			]);

			const data = new TextEncoder().encode('Hello, World!');

			const signature = await window.crypto.subtle.sign('HMAC', key, data);

			expect(signature).toBeInstanceOf(ArrayBuffer);

			const isValid = await window.crypto.subtle.verify('HMAC', key, signature, data);

			expect(isValid).toBe(true);
		});
	});

	describe('digest()', () => {
		it('Computes SHA-256 digest', async () => {
			const data = new TextEncoder().encode('Hello, World!');

			const digest = await window.crypto.subtle.digest('SHA-256', data);

			expect(digest).toBeInstanceOf(ArrayBuffer);
			expect(digest.byteLength).toBe(32); // SHA-256 produces 32 bytes
		});
	});

	describe('Cross-realm ArrayBuffer handling', () => {
		it('Handles ArrayBuffer created in a different VM context (issue #1924)', async () => {
			// Create a VM context to simulate the Jest environment scenario
			const vmContext = VM.createContext({
				Uint8Array: Uint8Array,
				ArrayBuffer: ArrayBuffer
			});

			// Create an ArrayBuffer in the VM context
			const vmScript = new VM.Script(`
				const arr = new Uint8Array([
					0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
					0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
					0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
					0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20
				]);
				arr.buffer;
			`);
			const vmBuffer = vmScript.runInContext(vmContext);

			// The wrapper should handle buffers from any realm
			// (In older Node versions, vmBuffer instanceof ArrayBuffer would be false)
			const key = await window.crypto.subtle.importKey('spki', vmBuffer, 'Ed25519', true, [
				'verify'
			]);

			expect(key).toBeDefined();
			expect(key.type).toBe('public');
			expect(key.algorithm.name).toBe('Ed25519');
		});

		it('Handles TypedArray with cross-realm underlying buffer', async () => {
			const vmContext = VM.createContext({
				Uint8Array: Uint8Array
			});

			const vmScript = new VM.Script(`
				new Uint8Array([
					0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00,
					0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
					0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
					0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20
				]);
			`);
			const vmTypedArray = vmScript.runInContext(vmContext);

			// The wrapper should handle this cross-realm TypedArray
			const key = await window.crypto.subtle.importKey('spki', vmTypedArray, 'Ed25519', true, [
				'verify'
			]);

			expect(key).toBeDefined();
			expect(key.type).toBe('public');
		});
	});

	describe('getRandomValues()', () => {
		it('Fills array with random values', () => {
			const array = new Uint8Array(16);
			const result = window.crypto.getRandomValues(array);

			expect(result).toBe(array);
			// Check that at least some values are non-zero (statistically very likely)
			expect(array.some((v) => v !== 0)).toBe(true);
		});
	});

	describe('randomUUID()', () => {
		it('Generates a valid UUID', () => {
			const uuid = window.crypto.randomUUID();

			expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
		});
	});
});
