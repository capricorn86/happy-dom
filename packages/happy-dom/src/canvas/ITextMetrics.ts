export default interface ITextMetrics {
	readonly alphabeticBaseline: number;
	readonly actualBoundingBoxAscent: number;
	readonly actualBoundingBoxDescent: number;
	readonly actualBoundingBoxLeft: number;
	readonly actualBoundingBoxRight: number;
	readonly emHeightAscent: number;
	readonly emHeightDescent: number;
	readonly fontBoundingBoxAscent: number;
	readonly fontBoundingBoxDescent: number;
	readonly width: number;
}
