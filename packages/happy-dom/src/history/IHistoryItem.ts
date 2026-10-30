import type FormData from '../form-data/FormData.js';
import type HistoryScrollRestorationEnum from './HistoryScrollRestorationEnum.js';

export default interface IHistoryItem {
	title: string | null;
	url: string;
	state: any | null;
	popState: boolean;
	scrollRestoration: HistoryScrollRestorationEnum;
	method: string;
	formData: FormData | null;
	// The fetched source URL.
	sourceURL: string | null;
}
