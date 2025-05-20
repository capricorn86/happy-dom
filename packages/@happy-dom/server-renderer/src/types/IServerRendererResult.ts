export default interface IServerRendererResult {
	url: string;
	content: string | null;
	status: number;
	statusText: string;
	headers: { [key: string]: string };
	outputFile: string | null;
	error: string | null;
	pageErrors: string[];
	pageConsole: string;
}
