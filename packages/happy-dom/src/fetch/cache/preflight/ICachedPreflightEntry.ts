/**
 * A cache entry created from a successful preflight response.
 *
 * Each entry holds either an allowed method or an allowed header name. The origin and URL of the entry are used as the key in the cache.
 *
 * @see https://fetch.spec.whatwg.org/#concept-cache
 */
export default interface ICachedPreflightEntry {
	expires: number;
	credentials: boolean;
	method: string | null;
	headerName: string | null;
}
