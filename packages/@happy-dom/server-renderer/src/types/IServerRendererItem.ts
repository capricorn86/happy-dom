export default interface IServerRendererItem {
	url: string;
	outputFile?: string | null;
	headers?: string[][] | { [key: string]: string } | null;
}
