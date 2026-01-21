import { webcrypto } from 'crypto';
import SubtleCryptoWrapper from './SubtleCryptoWrapper.js';

type NodeSubtleCrypto = webcrypto.SubtleCrypto;

/**
 * Wraps Node.js webcrypto to handle cross-realm ArrayBuffer issues.
 *
 * When Happy DOM runs in a VM context (e.g., Jest environment), ArrayBuffer
 * instances created in the VM context are not recognized by Node.js's native
 * webcrypto implementation because they fail instanceof checks.
 *
 * This wrapper provides a SubtleCrypto implementation that converts buffer
 * arguments to Node.js's realm before passing them to the underlying implementation.
 *
 * @see https://github.com/capricorn86/happy-dom/issues/1924
 */
export default class CryptoWrapper {
	readonly #subtle: SubtleCryptoWrapper;

	/**
	 * Constructor.
	 */
	constructor() {
		this.#subtle = new SubtleCryptoWrapper();
	}

	/**
	 * Returns the SubtleCrypto interface.
	 *
	 * @returns SubtleCrypto interface.
	 */
	public get subtle(): NodeSubtleCrypto {
		return <NodeSubtleCrypto>(<unknown>this.#subtle);
	}

	/**
	 * Fills the provided TypedArray with cryptographically secure random values.
	 *
	 * @param array Array to fill.
	 * @returns The input array filled with random values.
	 */
	public getRandomValues<T extends ArrayBufferView | null>(array: T): T {
		return <T>(<unknown>webcrypto.getRandomValues(<Uint8Array>(<unknown>array)));
	}

	/**
	 * Generates a random UUID.
	 *
	 * @returns A random UUID string.
	 */
	public randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
		return webcrypto.randomUUID();
	}
}
