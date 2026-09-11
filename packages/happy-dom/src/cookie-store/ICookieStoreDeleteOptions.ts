/**
 * Options for CookieStore.delete().
 */
export default interface ICookieStoreDeleteOptions {
	name: string;
	domain?: string | null;
	path?: string;
	partitioned?: boolean;
}
