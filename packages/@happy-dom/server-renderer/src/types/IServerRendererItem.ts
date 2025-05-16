export default interface IServerRendererItem {
	url: string;
	outputFile?: string;
	headers?: string[][] | { [key: string]: string };
}
