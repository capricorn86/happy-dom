export default interface IServerRendererResult {
	url: string | null;
	content: string | null;
	status: number | null;
	statusText: string | null;
	headers: { [key: string]: string } | null;
	outputFile: string | null;
	error: string | null;
	pageErrors: string[];
	pageConsole: string;
}
