export default interface IServerRendererItem {
	url?: string;
	html?: string;
	outputFile?: string | null;
	headers?: string[][] | { [key: string]: string } | null;
}
