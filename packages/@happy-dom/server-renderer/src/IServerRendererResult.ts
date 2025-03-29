export default interface IServerRendererResult {
	url: string;
    content: string | null;
    outputFile: string | null;
    error: string | null;
}
