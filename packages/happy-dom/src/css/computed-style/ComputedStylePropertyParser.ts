/**
 * Computed style property parser.
 */
export default class ComputedStylePropertyParser {
	/**
	 * Parses a style property.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @returns Property value.
	 */
	public static parseProperty(name: string, value: string): { [k: string]: string } {
		switch (name) {
			case 'border':
				const borderParts = value.split(/ +/);

				if (borderParts.length < 2) {
					return {};
				}

				const borderWidth = this.toPixels(borderParts[0]);
				const borderColor = this.toPixels(borderParts[0]);

				return {
					border: `${borderWidth} ${borderParts[1]} ${borderColor}`,
					'border-top': `${borderWidth} ${borderParts[1]} ${borderColor}`,
					'border-bottom': `${borderWidth} ${borderParts[1]} ${borderColor}`,
					'border-left': `${borderWidth} ${borderParts[1]} ${borderColor}`,
					'border-right': `${borderWidth} ${borderParts[1]} ${borderColor}`,
					'border-top-width': borderWidth,
					'border-right-width': borderWidth,
					'border-bottom-width': borderWidth,
					'border-left-width': borderWidth,
					'border-top-style': borderParts[1],
					'border-right-style': borderParts[1],
					'border-bottom-style': borderParts[1],
					'border-left-style': borderParts[1],
					'border-top-color': borderColor,
					'border-right-color': borderColor,
					'border-bottom-color': borderColor,
					'border-left-color': borderColor,

					// TODO: How to parse image from the border value?
					'border-image-source': 'none',
					'border-image-slice': '100%',
					'border-image-width': '1',
					'border-image-outset': '0',
					'border-image-repeat': 'stretch'
				};
			case 'border-left':
			case 'border-bottom':
			case 'border-right':
			case 'border-top':
				const borderPostionedParts = value.split(/ +/);

				if (borderPostionedParts.length < 2) {
					return {};
				}

				const borderName = name.split('-')[1];
				const borderPositionedWidth = this.toPixels(borderPostionedParts[0]);
				const borderPositionedColor = borderPostionedParts[2]
					? this.toRGB(borderPostionedParts[2])
					: 'rgb(0, 0, 0)';

				return {
					[`border-${borderName}`]: `${borderPositionedWidth} ${borderPostionedParts[1]} ${borderPositionedColor}`,
					[`border-${borderName}-width`]: borderPositionedWidth,
					[`border-${borderName}-style`]: borderPostionedParts[1],
					[`border-${borderName}-color`]: borderPositionedColor
				};
			case 'border-width':
				const borderWidthValue = this.toPixels(value);
				return {
					'border-top-width': borderWidthValue,
					'border-right-width': borderWidthValue,
					'border-bottom-width': borderWidthValue,
					'border-left-width': borderWidthValue
				};
			case 'border-style':
				return {
					'border-top-style': value,
					'border-right-style': value,
					'border-bottom-style': value,
					'border-left-style': value
				};
			case 'border-color':
				const borderColorValue = this.toRGB(value);
				return {
					'border-top-color': borderColorValue,
					'border-right-color': borderColorValue,
					'border-bottom-color': borderColorValue,
					'border-left-color': borderColorValue
				};
			case 'border-radius':
				const borderRadiusParts = value.split(/ +/);
				const borderRadiusTopLeftValue = this.toPixels(borderRadiusParts[0]);
				const borderRadiusTopRightValue = borderRadiusParts[1]
					? this.toPixels(borderRadiusParts[1])
					: '';
				const borderRadiusBottomRightValue = borderRadiusParts[2]
					? this.toPixels(borderRadiusParts[2])
					: '';
				const borderRadiusBottomLeftValue = borderRadiusParts[3]
					? this.toPixels(borderRadiusParts[3])
					: '';
				return {
					'border-radius': `${borderRadiusTopLeftValue}${
						borderRadiusTopRightValue ? ` ${borderRadiusTopRightValue}` : ''
					}${borderRadiusBottomRightValue ? ` ${borderRadiusBottomRightValue}` : ''}${
						borderRadiusBottomLeftValue ? ` ${borderRadiusBottomLeftValue}` : ''
					}`,
					'border-top-left-radius': borderRadiusTopLeftValue || borderRadiusTopLeftValue,
					'border-top-right-radius': borderRadiusTopRightValue || borderRadiusTopLeftValue,
					'border-bottom-right-radius': borderRadiusBottomRightValue || borderRadiusTopLeftValue,
					'border-bottom-left-radius':
						borderRadiusBottomLeftValue || borderRadiusTopRightValue || borderRadiusTopLeftValue
				};
			case 'padding':
			case 'margin':
				const paddingParts = value.split(/ +/);
				const paddingTopValue = this.toPixels(paddingParts[0]);
				const paddingRightValue = paddingParts[1] ? this.toPixels(paddingParts[1]) : '';
				const paddingBottomValue = paddingParts[2] ? this.toPixels(paddingParts[2]) : '';
				const paddingLeftValue = paddingParts[2] ? this.toPixels(paddingParts[2]) : '';
				return {
					[name]: `${paddingTopValue}${paddingRightValue ? ` ${paddingRightValue}` : ''}${
						paddingBottomValue ? ` ${paddingBottomValue}` : ''
					}${paddingLeftValue ? ` ${paddingLeftValue}` : ''}`,
					[`${name}-top`]: paddingTopValue,
					[`${name}-right`]: paddingRightValue || paddingParts[0],
					[`${name}-bottom`]: paddingBottomValue || paddingParts[0],
					[`${name}-left`]: paddingLeftValue || paddingParts[1] || paddingParts[0]
				};
		}

		return {
			[name]: value
		};
	}

	/**
	 * Returns value in pixels.
	 *
	 * @param value Value.
	 * @returns Value in pixels.
	 */
	private static toPixels(value: string): string {
		// TODO: Fix convertion to pixels
		return value;
	}

	/**
	 * Returns value in pixels.
	 *
	 * @param value Value.
	 * @returns Value in RGB.
	 */
	private static toRGB(value: string): string {
		// TODO: Fix convertion to RGB
		return value;
	}
}
