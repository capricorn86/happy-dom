export default interface IImageBitmapOptions {
	imageOrientation?: 'from-image' | 'flipY' | 'none';
	premultiplyAlpha?: 'none' | 'premultiply' | 'default';
	colorSpaceConversion?: 'default' | 'none';
	resizeWidth?: number;
	resizeHeight?: number;
	resizeQuality?: 'pixelated' | 'low' | 'medium' | 'high';
}
