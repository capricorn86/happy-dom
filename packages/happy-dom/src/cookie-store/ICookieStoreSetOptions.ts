/**
 * Options for CookieStore.set().
 */
export default interface ICookieStoreSetOptions {
	name: string;
	value?: string;
	domain?: string | null;
	expires?: number | Date | null;
	path?: string;
	sameSite?: 'strict' | 'lax' | 'none';
	partitioned?: boolean;
}
