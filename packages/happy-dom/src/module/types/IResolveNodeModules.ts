/**
 * Interface representing the structure for resolving node modules into an URL.
 */
export default interface IResolveNodeModules {
	url: string;
	directory: string;
	mainFields?: string[];
}
