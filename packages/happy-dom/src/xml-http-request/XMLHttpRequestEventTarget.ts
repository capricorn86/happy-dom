import ProgressEvent from '../event/events/ProgressEvent';
import EventTarget from '../event/EventTarget';

export type ProgressEventListener = (event: ProgressEvent) => void;

/**
 * References: https://xhr.spec.whatwg.org/#xmlhttprequesteventtarget.
 */
export class XMLHttpRequestEventTarget extends EventTarget {
	public onloadstart: ProgressEventListener | null;
	public onprogress: ProgressEventListener | null;
	public onabort: ProgressEventListener | null;
	public onerror: ProgressEventListener | null;
	public onload: ProgressEventListener | null;
	public ontimeout: ProgressEventListener | null;
	public onloadend: ProgressEventListener | null;
}
