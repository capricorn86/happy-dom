import type FormData from '../form-data/FormData.js';
import type HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';

export default interface IHistoryItem {
	title: string | null;
	url: string;
	state: any | null;
	scrollRestoration: HistoryScrollRestorationEnum;
	method: string;
	formData: FormData | null;
	// The navigated URL using the browser, links etc.
	navigationURL: string | null;
	// Indicates whether the history item should inherit the origin from the parent frame.
	inheritOrigin: boolean;
}
