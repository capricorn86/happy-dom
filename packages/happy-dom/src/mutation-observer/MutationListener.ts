import IMutationObserverInit from './IMutationObserverInit.js';
import MutationObserver from './MutationObserver.js';
import MutationRecord from './MutationRecord.js';

/**
 * MutationObserverListener is a model for what to listen for on a Node.
 */
export default class MutationListener {
	public options: IMutationObserverInit = null;
	public observer: MutationObserver = null;
	public callback: (record: MutationRecord[], observer: MutationObserver) => void = null;
}
