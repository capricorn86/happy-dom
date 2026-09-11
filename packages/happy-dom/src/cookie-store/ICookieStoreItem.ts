/**
 * Cookie item returned by CookieStore.get() and CookieStore.getAll().
 */
export default interface ICookieStoreItem {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires: number | null;
	secure: boolean;
	sameSite: 'strict' | 'lax' | 'none';
	partitioned: boolean;
}
