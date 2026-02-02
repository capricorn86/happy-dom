import type IMutationObserverInit from './IMutationObserverInit.js';
import type MutationRecord from './MutationRecord.js';

export default interface IMutationListener {
	options: IMutationObserverInit;
	callback: WeakRef<(record: MutationRecord) => void>;
}
