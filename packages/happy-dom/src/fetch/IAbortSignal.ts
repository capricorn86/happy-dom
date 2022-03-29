/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Abort signal.
 */
export default interface IAbortSignal {
	aborted: boolean;

	addEventListener: (
		type: 'abort',
		listener: (this: IAbortSignal, event: any) => any,
		options?:
			| boolean
			| {
					capture?: boolean | undefined;
					once?: boolean | undefined;
					passive?: boolean | undefined;
			  }
	) => void;

	removeEventListener: (
		type: 'abort',
		listener: (this: IAbortSignal, event: any) => any,
		options?:
			| boolean
			| {
					capture?: boolean | undefined;
			  }
	) => void;

	dispatchEvent: (event: any) => boolean;

	onabort: null | ((this: IAbortSignal, event: any) => void);
}
