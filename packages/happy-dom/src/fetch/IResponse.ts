import IHeaders from './IHeaders';
import IBody from './IBody';

/**
 * Fetch response.
 */
export default interface IResponse extends IBody {
	readonly headers: IHeaders;
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly type: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
	readonly url: string;

	/**
	 * Returns a clone.
	 *
	 * @returns Clone.
	 */
	clone(): IResponse;
}
