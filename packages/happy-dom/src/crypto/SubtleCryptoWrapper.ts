import { webcrypto } from 'crypto';

// Import WebCrypto types from Node.js
type BufferSource = ArrayBufferView | ArrayBuffer;
type CryptoKey = webcrypto.CryptoKey;
type CryptoKeyPair = webcrypto.CryptoKeyPair;
type SubtleCrypto = webcrypto.SubtleCrypto;
type AlgorithmIdentifier = webcrypto.AlgorithmIdentifier;
type KeyFormat = webcrypto.KeyFormat;
type KeyUsage = webcrypto.KeyUsage;
type JsonWebKey = webcrypto.JsonWebKey;

// Algorithm parameter types
type RsaOaepParams = webcrypto.RsaOaepParams;
type AesCtrParams = webcrypto.AesCtrParams;
type AesCbcParams = webcrypto.AesCbcParams;
type AesGcmParams = webcrypto.AesGcmParams;
type RsaPssParams = webcrypto.RsaPssParams;
type EcdsaParams = webcrypto.EcdsaParams;
type RsaHashedKeyGenParams = webcrypto.RsaHashedKeyGenParams;
type EcKeyGenParams = webcrypto.EcKeyGenParams;
type AesKeyGenParams = webcrypto.AesKeyGenParams;
type HmacKeyGenParams = webcrypto.HmacKeyGenParams;
type Pbkdf2Params = webcrypto.Pbkdf2Params;
type EcdhKeyDeriveParams = webcrypto.EcdhKeyDeriveParams;
type HkdfParams = webcrypto.HkdfParams;
type AesDerivedKeyParams = webcrypto.AesDerivedKeyParams;
type HmacImportParams = webcrypto.HmacImportParams;
type RsaHashedImportParams = webcrypto.RsaHashedImportParams;
type EcKeyImportParams = webcrypto.EcKeyImportParams;
type AesKeyAlgorithm = webcrypto.AesKeyAlgorithm;

/**
 * Converts a buffer from any realm to the current Node.js realm.
 *
 * This is necessary because when running in VM contexts (like Jest environments),
 * ArrayBuffer instances from the VM context fail instanceof checks against
 * Node.js's ArrayBuffer, causing webcrypto methods to reject valid buffers.
 *
 * @see https://github.com/capricorn86/happy-dom/issues/1924
 * @param buffer The buffer to convert.
 * @returns A buffer in the current Node.js realm.
 */
function toNodeRealm(buffer: BufferSource): BufferSource {
	if (buffer instanceof ArrayBuffer) {
		// Already in Node's realm
		return buffer;
	}

	if (ArrayBuffer.isView(buffer)) {
		// TypedArray or DataView - check if the underlying buffer needs conversion
		if (buffer.buffer instanceof ArrayBuffer) {
			return buffer;
		}
		// Convert the underlying ArrayBuffer to Node's realm
		const nodeBuffer = new Uint8Array(Buffer.from(buffer.buffer)).buffer;
		if (buffer instanceof DataView) {
			return new DataView(nodeBuffer, buffer.byteOffset, buffer.byteLength);
		}
		// For TypedArrays, create a new view of the same type
		const TypedArrayConstructor = <
			new (buffer: ArrayBuffer, byteOffset: number, length: number) => ArrayBufferView
		>buffer.constructor;
		return new TypedArrayConstructor(
			nodeBuffer,
			buffer.byteOffset,
			buffer.byteLength / ((<{ BYTES_PER_ELEMENT?: number }>buffer).BYTES_PER_ELEMENT || 1)
		);
	}

	// ArrayBuffer from another realm - convert via Buffer
	return new Uint8Array(Buffer.from(buffer)).buffer;
}

/**
 * Wraps Node.js webcrypto.subtle to handle cross-realm ArrayBuffer issues.
 *
 * When Happy DOM runs in a VM context (e.g., Jest environment), ArrayBuffer
 * instances created in the VM context are not recognized by Node.js's native
 * webcrypto implementation because they fail instanceof checks.
 *
 * This wrapper converts buffer arguments to Node.js's realm before passing
 * them to the underlying SubtleCrypto implementation.
 *
 * @see https://github.com/capricorn86/happy-dom/issues/1924
 * @see https://github.com/nodejs/node/issues/55380
 */
export default class SubtleCryptoWrapper implements SubtleCrypto {
	readonly #subtle: SubtleCrypto;

	/**
	 * Constructor.
	 */
	constructor() {
		this.#subtle = webcrypto.subtle;
	}

	/**
	 * Encrypts data.
	 *
	 * @param algorithm Encryption algorithm.
	 * @param key Encryption key.
	 * @param data Data to encrypt.
	 * @returns Encrypted data.
	 */
	public async encrypt(
		algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
		key: CryptoKey,
		data: BufferSource
	): Promise<ArrayBuffer> {
		return this.#subtle.encrypt(algorithm, key, toNodeRealm(data));
	}

	/**
	 * Decrypts data.
	 *
	 * @param algorithm Decryption algorithm.
	 * @param key Decryption key.
	 * @param data Data to decrypt.
	 * @returns Decrypted data.
	 */
	public async decrypt(
		algorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
		key: CryptoKey,
		data: BufferSource
	): Promise<ArrayBuffer> {
		return this.#subtle.decrypt(algorithm, key, toNodeRealm(data));
	}

	/**
	 * Signs data.
	 *
	 * @param algorithm Signing algorithm.
	 * @param key Signing key.
	 * @param data Data to sign.
	 * @returns Signature.
	 */
	public async sign(
		algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
		key: CryptoKey,
		data: BufferSource
	): Promise<ArrayBuffer> {
		return this.#subtle.sign(algorithm, key, toNodeRealm(data));
	}

	/**
	 * Verifies a signature.
	 *
	 * @param algorithm Verification algorithm.
	 * @param key Verification key.
	 * @param signature Signature to verify.
	 * @param data Data that was signed.
	 * @returns Whether the signature is valid.
	 */
	public async verify(
		algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
		key: CryptoKey,
		signature: BufferSource,
		data: BufferSource
	): Promise<boolean> {
		return this.#subtle.verify(algorithm, key, toNodeRealm(signature), toNodeRealm(data));
	}

	/**
	 * Computes a digest.
	 *
	 * @param algorithm Digest algorithm.
	 * @param data Data to digest.
	 * @returns Digest.
	 */
	public async digest(algorithm: AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer> {
		return this.#subtle.digest(algorithm, toNodeRealm(data));
	}

	/**
	 * Generates a key or key pair.
	 *
	 * @param algorithm Key generation algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Generated key or key pair.
	 */
	public async generateKey(
		algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKeyPair>;
	/**
	 * Generates a key or key pair.
	 *
	 * @param algorithm Key generation algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Generated key or key pair.
	 */
	public async generateKey(
		algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey>;
	/**
	 * Generates a key or key pair.
	 *
	 * @param algorithm Key generation algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Generated key or key pair.
	 */
	public async generateKey(
		algorithm: AlgorithmIdentifier,
		extractable: boolean,
		keyUsages: KeyUsage[]
	): Promise<CryptoKeyPair | CryptoKey>;
	/**
	 * Generates a key or key pair.
	 *
	 * @param algorithm Key generation algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Generated key or key pair.
	 */
	public async generateKey(
		algorithm: AlgorithmIdentifier,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKeyPair | CryptoKey> {
		return this.#subtle.generateKey(
			<RsaHashedKeyGenParams>algorithm,
			extractable,
			<KeyUsage[]>keyUsages
		);
	}

	/**
	 * Derives a key from a master key.
	 *
	 * @param algorithm Derivation algorithm.
	 * @param baseKey Base key.
	 * @param derivedKeyType Derived key type.
	 * @param extractable Whether the derived key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Derived key.
	 */
	public async deriveKey(
		algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params,
		baseKey: CryptoKey,
		derivedKeyType:
			| AlgorithmIdentifier
			| AesDerivedKeyParams
			| HmacImportParams
			| HkdfParams
			| Pbkdf2Params,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey> {
		return this.#subtle.deriveKey(
			algorithm,
			baseKey,
			derivedKeyType,
			extractable,
			<KeyUsage[]>keyUsages
		);
	}

	/**
	 * Derives bits from a master key.
	 *
	 * @param algorithm Derivation algorithm.
	 * @param baseKey Base key.
	 * @param length Number of bits to derive.
	 * @returns Derived bits.
	 */
	public async deriveBits(
		algorithm: AlgorithmIdentifier | EcdhKeyDeriveParams | HkdfParams | Pbkdf2Params,
		baseKey: CryptoKey,
		length: number
	): Promise<ArrayBuffer> {
		return this.#subtle.deriveBits(algorithm, baseKey, length);
	}

	/**
	 * Imports a key.
	 *
	 * @param format Key format.
	 * @param keyData Key data.
	 * @param algorithm Import algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Imported key.
	 */
	public async importKey(
		format: 'jwk',
		keyData: JsonWebKey,
		algorithm:
			| AlgorithmIdentifier
			| RsaHashedImportParams
			| EcKeyImportParams
			| HmacImportParams
			| AesKeyAlgorithm,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey>;
	/**
	 * Imports a key.
	 *
	 * @param format Key format.
	 * @param keyData Key data.
	 * @param algorithm Import algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Imported key.
	 */
	public async importKey(
		format: Exclude<KeyFormat, 'jwk'>,
		keyData: BufferSource,
		algorithm:
			| AlgorithmIdentifier
			| RsaHashedImportParams
			| EcKeyImportParams
			| HmacImportParams
			| AesKeyAlgorithm,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey>;
	/**
	 * Imports a key.
	 *
	 * @param format Key format.
	 * @param keyData Key data.
	 * @param algorithm Import algorithm.
	 * @param extractable Whether the key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Imported key.
	 */
	public async importKey(
		format: KeyFormat,
		keyData: JsonWebKey | BufferSource,
		algorithm:
			| AlgorithmIdentifier
			| RsaHashedImportParams
			| EcKeyImportParams
			| HmacImportParams
			| AesKeyAlgorithm,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey> {
		if (format === 'jwk') {
			return this.#subtle.importKey(
				format,
				<JsonWebKey>keyData,
				algorithm,
				extractable,
				<KeyUsage[]>keyUsages
			);
		}
		return this.#subtle.importKey(
			format,
			toNodeRealm(<BufferSource>keyData),
			algorithm,
			extractable,
			<KeyUsage[]>keyUsages
		);
	}

	/**
	 * Exports a key.
	 *
	 * @param format Export format.
	 * @param key Key to export.
	 * @returns Exported key.
	 */
	public async exportKey(format: 'jwk', key: CryptoKey): Promise<JsonWebKey>;
	/**
	 * Exports a key.
	 *
	 * @param format Export format.
	 * @param key Key to export.
	 * @returns Exported key.
	 */
	public async exportKey(format: Exclude<KeyFormat, 'jwk'>, key: CryptoKey): Promise<ArrayBuffer>;
	/**
	 * Exports a key.
	 *
	 * @param format Export format.
	 * @param key Key to export.
	 * @returns Exported key.
	 */
	public async exportKey(format: KeyFormat, key: CryptoKey): Promise<JsonWebKey | ArrayBuffer> {
		return this.#subtle.exportKey(<'jwk'>format, key);
	}

	/**
	 * Wraps a key.
	 *
	 * @param format Key format.
	 * @param key Key to wrap.
	 * @param wrappingKey Wrapping key.
	 * @param wrapAlgorithm Wrap algorithm.
	 * @returns Wrapped key.
	 */
	public async wrapKey(
		format: KeyFormat,
		key: CryptoKey,
		wrappingKey: CryptoKey,
		wrapAlgorithm: AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams
	): Promise<ArrayBuffer> {
		return this.#subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm);
	}

	/**
	 * Unwraps a key.
	 *
	 * @param format Key format.
	 * @param wrappedKey Wrapped key.
	 * @param unwrappingKey Unwrapping key.
	 * @param unwrapAlgorithm Unwrap algorithm.
	 * @param unwrappedKeyAlgorithm Unwrapped key algorithm.
	 * @param extractable Whether the unwrapped key is extractable.
	 * @param keyUsages Key usages.
	 * @returns Unwrapped key.
	 */
	public async unwrapKey(
		format: KeyFormat,
		wrappedKey: BufferSource,
		unwrappingKey: CryptoKey,
		unwrapAlgorithm:
			| AlgorithmIdentifier
			| RsaOaepParams
			| AesCtrParams
			| AesCbcParams
			| AesGcmParams,
		unwrappedKeyAlgorithm:
			| AlgorithmIdentifier
			| RsaHashedImportParams
			| EcKeyImportParams
			| HmacImportParams
			| AesKeyAlgorithm,
		extractable: boolean,
		keyUsages: readonly KeyUsage[]
	): Promise<CryptoKey> {
		return this.#subtle.unwrapKey(
			format,
			toNodeRealm(wrappedKey),
			unwrappingKey,
			unwrapAlgorithm,
			unwrappedKeyAlgorithm,
			extractable,
			<KeyUsage[]>keyUsages
		);
	}
}
