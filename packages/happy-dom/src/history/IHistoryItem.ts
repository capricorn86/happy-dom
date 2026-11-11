import type HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';
import type IHistoryDocumentState from './IHistoryDocumentState.js';

export default interface IHistoryItem {
	title: string | null;
	url: string;
	state: any | null;
	scrollRestoration: HistoryScrollRestorationEnum;
	// Shared by reference between items of the same document (e.g. pushState() and fragment navigation).
	documentState: IHistoryDocumentState;
}
