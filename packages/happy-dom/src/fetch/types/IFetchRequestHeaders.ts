/**
 * Fetch request header.
 */
export default interface IFetchRequestHeaders {
	url: string | RegExp;
	headers: {
		[key: string]: string;
	};
}
