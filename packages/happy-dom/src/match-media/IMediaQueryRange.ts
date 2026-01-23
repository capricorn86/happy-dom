export default interface IMediaQueryRange {
	before: { value: string; operator: string } | null;
	type: string;
	after: { value: string; operator: string } | null;
}
