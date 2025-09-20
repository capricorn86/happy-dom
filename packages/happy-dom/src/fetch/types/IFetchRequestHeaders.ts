/**
 * Fetch request header.
 */
export default interface IFetchRequestHeaders {
	url?: string | RegExp | null;
	headers: {
		[key: string]: string;
	};
}
