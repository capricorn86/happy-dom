import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationValueParser from './CSSStyleDeclarationValueParser';
import CSSStyleDeclarationPropertyManagerPropertyNames from './CSSStyleDeclarationPropertyManagerPropertyNames';

/**
 * Computed this.properties property parser.
 */
export default class CSSStyleDeclarationPropertyManager {
	private properties: {
		[k: string]: ICSSStyleDeclarationProperty;
	} = {};

	/**
	 * Class construtor.
	 *
	 * @param [cssString] CSS string.
	 */
	constructor(cssString?: string) {
		if (cssString) {
			const parts = cssString.split(';');

			for (const part of parts) {
				if (part) {
					const [name, value]: string[] = part.trim().split(':');
					if (value) {
						const trimmedName = name.trim();
						const trimmedValue = value.trim();
						if (trimmedName && trimmedValue) {
							const important = trimmedValue.endsWith(' !important');
							const valueWithoutImportant = trimmedValue.replace(' !important', '');

							if (valueWithoutImportant) {
								this.set(trimmedName, valueWithoutImportant, important);
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Returns property value.
	 *
	 * @param name Property name.
	 * @returns Property value.
	 */
	public get(name: string): string {
		switch (name) {
			case 'margin':
				if (!this.properties['margin-top']?.value) {
					return '';
				}
				return `${this.properties['margin-top']?.value} ${this.properties['margin-right']?.value} ${this.properties['margin-bottom']?.value} ${this.properties['margin-left']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'padding':
				if (!this.properties['padding-top']?.value) {
					return '';
				}
				return `${this.properties['padding-top']?.value} ${this.properties['padding-right']?.value} ${this.properties['padding-bottom']?.value} ${this.properties['padding-left']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'border':
				if (
					!this.properties['border-top-width']?.value ||
					!this.properties['border-top-style']?.value ||
					!this.properties['border-top-color']?.value ||
					this.properties['border-right-width']?.value !==
						this.properties['border-top-width']?.value ||
					this.properties['border-right-style']?.value !==
						this.properties['border-top-style']?.value ||
					this.properties['border-right-color']?.value !==
						this.properties['border-top-color']?.value ||
					this.properties['border-bottom-width']?.value !==
						this.properties['border-top-width']?.value ||
					this.properties['border-bottom-style']?.value !==
						this.properties['border-top-style']?.value ||
					this.properties['border-bottom-color']?.value !==
						this.properties['border-top-color']?.value ||
					this.properties['border-left-width']?.value !==
						this.properties['border-top-width']?.value ||
					this.properties['border-left-style']?.value !==
						this.properties['border-top-style']?.value ||
					this.properties['border-left-color']?.value !== this.properties['border-top-color']?.value
				) {
					return '';
				}
				return `${this.properties['border-top-width'].value} ${this.properties['border-top-style'].value} ${this.properties['border-top-color'].value}`;
			case 'border-left':
				if (
					!this.properties['border-left-width']?.value ||
					!this.properties['border-left-style']?.value ||
					!this.properties['border-left-color']?.value
				) {
					return '';
				}
				return `${this.properties['border-left-width'].value} ${this.properties['border-left-style'].value} ${this.properties['border-left-color'].value}`;
			case 'border-right':
				if (
					!this.properties['border-right-width']?.value ||
					!this.properties['border-right-style']?.value ||
					!this.properties['border-right-color']?.value
				) {
					return '';
				}
				return `${this.properties['border-right-width'].value} ${this.properties['border-right-style'].value} ${this.properties['border-right-color'].value}`;
			case 'border-top':
				if (
					!this.properties['border-top-width']?.value ||
					!this.properties['border-top-style']?.value ||
					!this.properties['border-top-color']?.value
				) {
					return '';
				}
				return `${this.properties['border-top-width'].value} ${this.properties['border-top-style'].value} ${this.properties['border-top-color'].value}`;
			case 'border-bottom':
				if (
					!this.properties['border-bottom-width']?.value ||
					!this.properties['border-bottom-style']?.value ||
					!this.properties['border-bottom-color']?.value
				) {
					return '';
				}
				return `${this.properties['border-bottom-width'].value} ${this.properties['border-bottom-style'].value} ${this.properties['border-bottom-color'].value}`;
			case 'background':
				if (
					!this.properties['background-color']?.value &&
					!this.properties['background-image']?.value
				) {
					return '';
				}
				return `${this.properties['background-color']?.value} ${this.properties['background-image']?.value} ${this.properties['background-repeat']?.value} ${this.properties['background-attachment']?.value} ${this.properties['background-position']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'flex':
				if (
					!this.properties['flex-grow']?.value ||
					!this.properties['flex-shrink']?.value ||
					!this.properties['flex-basis']?.value
				) {
					return '';
				}
				return `${this.properties['flex-grow'].value} ${this.properties['flex-shrink'].value} ${this.properties['flex-basis'].value}`;
		}

		return this.properties[name]?.value || '';
	}

	/**
	 * Removes a property.
	 *
	 * @param name Property name.
	 */
	public remove(name: string): void {
		if (CSSStyleDeclarationPropertyManagerPropertyNames[name]) {
			for (const propertyName of CSSStyleDeclarationPropertyManagerPropertyNames[name]) {
				delete this.properties[propertyName];
			}
		} else {
			delete this.properties[name];
		}
	}

	/**
	 * Sets a property
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	public set(name: string, value: string, important: boolean): void {
		switch (name) {
			case 'border':
				this.setBorder(name, value, important);
				break;
			case 'border-left':
			case 'border-bottom':
			case 'border-right':
			case 'border-top':
				this.setBorderPosition(name, value, important);
				break;
			case 'border-width':
				value = CSSStyleDeclarationValueParser.getBorderWidth(value);
				if (value) {
					this.properties['border-top-width'] = { name, important, value };
					this.properties['border-right-width'] = { name, important, value };
					this.properties['border-bottom-width'] = { name, important, value };
					this.properties['border-left-width'] = { name, important, value };
				}
				break;
			case 'border-style':
				value = CSSStyleDeclarationValueParser.getBorderStyle(value);
				if (value) {
					this.properties['border-top-style'] = { name, important, value };
					this.properties['border-right-style'] = { name, important, value };
					this.properties['border-bottom-style'] = { name, important, value };
					this.properties['border-left-style'] = { name, important, value };
				}
				break;
			case 'border-color':
				value = CSSStyleDeclarationValueParser.getBorderCollapse(value);
				if (value) {
					this.properties['border-top-color'] = { name, important, value };
					this.properties['border-right-color'] = { name, important, value };
					this.properties['border-bottom-color'] = { name, important, value };
					this.properties['border-left-color'] = { name, important, value };
				}
				break;
			case 'border-radius':
				this.setBorderRadius(name, value, important);
				break;
			case 'border-collapse':
				value = CSSStyleDeclarationValueParser.getBorderCollapse(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'clear':
				value = CSSStyleDeclarationValueParser.getClear(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
			case 'clip':
				value = CSSStyleDeclarationValueParser.getClip(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'css-float':
			case 'float':
				value = CSSStyleDeclarationValueParser.getFloat(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'flex':
				this.setFlex(name, value, important);
				break;
			case 'flex-shrink':
			case 'flex-grow':
				value = CSSStyleDeclarationValueParser.getInteger(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'flex-basis':
				value = CSSStyleDeclarationValueParser.getFlexBasis(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'padding':
				this.setPadding(name, value, important);
				break;
			case 'margin':
				this.setMargin(name, value, important);
				break;
			case 'background':
				this.setBackground(name, value, important);
				break;
			case 'top':
			case 'right':
			case 'bottom':
			case 'left':
				value = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'padding-top':
			case 'padding-bottom':
			case 'padding-left':
			case 'padding-right':
				value = CSSStyleDeclarationValueParser.getMeasurement(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'margin-top':
			case 'margin-bottom':
			case 'margin-left':
			case 'margin-right':
				value = CSSStyleDeclarationValueParser.getMargin(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'border-top-width':
			case 'border-bottom-width':
			case 'border-left-width':
			case 'border-right-width':
				value = CSSStyleDeclarationValueParser.getBorderWidth(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'font-size':
				value = CSSStyleDeclarationValueParser.getFontSize(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'color':
			case 'flood-color':
			case 'border-top-color':
			case 'border-bottom-color':
			case 'border-left-color':
			case 'border-right-color':
				value = CSSStyleDeclarationValueParser.getColor(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			case 'border-top-style':
			case 'border-bottom-style':
			case 'border-left-style':
			case 'border-right-style':
				value = CSSStyleDeclarationValueParser.getBorderStyle(value);
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
			default:
				if (value) {
					this.properties[name] = { name, important, value };
				}
				break;
		}
	}

	/**
	 * Sets border.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setBorder(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? CSSStyleDeclarationValueParser.getBorderWidth(parts[0]) : '';
		const borderStyle = parts[1] ? CSSStyleDeclarationValueParser.getBorderStyle(parts[1]) : '';
		const borderColor = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			this.properties['border-top-width'] = { name, important, value: borderWidth };
			this.properties['border-top-style'] = { name, important, value: borderStyle };
			this.properties['border-top-color'] = { name, important, value: borderColor };
			this.properties['border-right-width'] = { name, important, value: borderWidth };
			this.properties['border-right-style'] = { name, important, value: borderStyle };
			this.properties['border-right-color'] = { name, important, value: borderColor };
			this.properties['border-bottom-width'] = { name, important, value: borderWidth };
			this.properties['border-bottom-style'] = { name, important, value: borderStyle };
			this.properties['border-bottom-color'] = { name, important, value: borderColor };
			this.properties['border-left-width'] = { name, important, value: borderWidth };
			this.properties['border-left-style'] = { name, important, value: borderStyle };
			this.properties['border-left-color'] = { name, important, value: borderColor };
		}
	}

	/**
	 * Sets border radius.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setBorderRadius(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);
		const topLeft = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		const topRight = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		const bottomRight = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		const bottomLeft = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';

		if (topLeft) {
			this.properties['border-top-left-radius'] = { name, important, value: topLeft };
		}
		if (topLeft && topRight) {
			this.properties['border-top-right-radius'] = { name, important, value: topRight };
		}
		if (topLeft && topRight && bottomRight) {
			this.properties['border-bottom-right-radius'] = { name, important, value: bottomRight };
		}
		if (topLeft && topRight && bottomRight && bottomLeft) {
			this.properties['border-bottom-left-radius'] = { name, important, value: bottomLeft };
		}
	}

	/**
	 * Sets border top, right, bottom or left.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setBorderPosition(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? CSSStyleDeclarationValueParser.getBorderWidth(parts[0]) : '';
		const borderStyle = parts[1] ? CSSStyleDeclarationValueParser.getBorderStyle(parts[1]) : '';
		const borderColor = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';
		const borderName = name.split('-')[1];

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			this.properties[`border-${borderName}-width`] = { name, important, value: borderWidth };
			this.properties[`border-${borderName}-style`] = { name, important, value: borderStyle };
			this.properties[`border-${borderName}-color`] = { name, important, value: borderColor };
		}
	}

	/**
	 * Sets padding.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setPadding(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);
		const top = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		const right = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		const bottom = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		const left = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';

		if (top) {
			this.properties['padding-top'] = { name, important, value: top };
		}
		if (top && right) {
			this.properties['padding-right'] = { name, important, value: right };
		}
		if (top && right && bottom) {
			this.properties['padding-bottom'] = { name, important, value: bottom };
		}
		if (top && right && bottom && left) {
			this.properties['padding-left'] = { name, important, value: left };
		}
	}

	/**
	 * Sets margin.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setMargin(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);
		const top = parts[0] ? CSSStyleDeclarationValueParser.getMargin(parts[0]) : '';
		const right = parts[1] ? CSSStyleDeclarationValueParser.getMargin(parts[1]) : '';
		const bottom = parts[2] ? CSSStyleDeclarationValueParser.getMargin(parts[2]) : '';
		const left = parts[3] ? CSSStyleDeclarationValueParser.getMargin(parts[3]) : '';

		if (top) {
			this.properties['margin-top'] = { name, important, value: top };
		}
		if (top && right) {
			this.properties['margin-right'] = { name, important, value: right };
		}
		if (top && right && bottom) {
			this.properties['margin-bottom'] = { name, important, value: bottom };
		}
		if (top && right && bottom && left) {
			this.properties['margin-left'] = { name, important, value: left };
		}
	}

	/**
	 * Sets flex.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setFlex(name: string, value: string, important: boolean): void {
		const lowerValue = value.trim().toLowerCase();

		switch (lowerValue) {
			case 'none':
				this.properties['flex-grow'] = { name, important, value: '0' };
				this.properties['flex-shrink'] = { name, important, value: '0' };
				this.properties['flex-basis'] = { name, important, value: 'auto' };
				return;
			case 'auto':
				this.properties['flex-grow'] = { name, important, value: '1' };
				this.properties['flex-shrink'] = { name, important, value: '1' };
				this.properties['flex-basis'] = { name, important, value: 'auto' };
				return;
			case 'initial':
				this.properties['flex-grow'] = { name, important, value: '0' };
				this.properties['flex-shrink'] = { name, important, value: '0' };
				this.properties['flex-basis'] = { name, important, value: 'auto' };
				return;
			case 'inherit':
				this.properties['flex-grow'] = { name, important, value: 'inherit' };
				this.properties['flex-shrink'] = { name, important, value: 'inherit' };
				this.properties['flex-basis'] = { name, important, value: 'inherit' };
				return;
		}

		const parts = value.split(/ +/);
		const flexGrow = parts[0] ? CSSStyleDeclarationValueParser.getInteger(parts[0]) : '';
		const flexShrink = parts[1] ? CSSStyleDeclarationValueParser.getInteger(parts[1]) : '';
		const flexBasis = parts[2] ? CSSStyleDeclarationValueParser.getFlexBasis(parts[2]) : '';

		if (flexGrow && flexShrink && flexBasis) {
			this.properties['flex-grow'] = { name, important, value: flexGrow };
			this.properties['flex-shrink'] = { name, important, value: flexShrink };
			this.properties['flex-basis'] = { name, important, value: flexBasis };
		}
	}

	/**
	 * Sets background.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	private setBackground(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);

		if (!parts[0]) {
			return;
		}

		// First value can be image if color is not specified.
		if (!CSSStyleDeclarationValueParser.getColor(parts[0])) {
			parts.unshift('');
		}

		const color = parts[0] ? CSSStyleDeclarationValueParser.getColor(parts[0]) : '';
		const image = parts[1] ? CSSStyleDeclarationValueParser.getURL(parts[1]) : '';
		const repeat = parts[2] ? CSSStyleDeclarationValueParser.getBackgroundRepeat(parts[2]) : '';
		const attachment = parts[3]
			? CSSStyleDeclarationValueParser.getBackgroundAttachment(parts[3])
			: '';
		const position = parts[4] ? CSSStyleDeclarationValueParser.getBackgroundPosition(parts[4]) : '';

		if ((color || image) && repeat !== null && attachment !== null && position !== null) {
			if (color) {
				this.properties['background-color'] = { name, important, value: color };
			}
			if (image) {
				this.properties['background-image'] = { name, important, value: image };
			}
			this.properties['background-repeat'] = { name, important, value: repeat };
			this.properties['background-attachment'] = { name, important, value: attachment };
			this.properties['background-position'] = { name, important, value: position };
		}
	}

	/**
	 * Reads a string.
	 *
	 * @param styleString Style string (e.g. "border: 2px solid red; font-size: 12px;").
	 */
	private fromString(styleString: string): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {}
}
