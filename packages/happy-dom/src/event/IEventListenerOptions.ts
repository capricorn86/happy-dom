import AbortSignal from 'src/fetch/AbortSignal.js';

export default interface IEventListenerOptions {
	once?: boolean;

	// TODO: Not implemented yet.
	capture?: boolean;
	passive?: boolean;
	signal?: AbortSignal;
}
