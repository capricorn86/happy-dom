import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';
import CSSStyleDeclarationPropertyValueParser from './CSSStyleDeclarationPropertyValueParser';

/**
 * Computed this.properties property parser.
 */
export default class CSSStyleDeclarationPropertyManager {
	private properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
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
				return `${this.properties['margin-top'].value} ${
					this.properties['margin-right']?.value || ''
				} ${
					this.properties['margin-top'].value !== this.properties['margin-bottom']?.value
						? this.properties['margin-bottom']?.value || ''
						: ''
				} ${
					this.properties['margin-right'].value !== this.properties['margin-left']?.value
						? this.properties['margin-left']?.value || ''
						: ''
				}`
					.replace(/  /g, '')
					.trim();
			case 'padding':
				if (!this.properties['padding-top']?.value) {
					return '';
				}
				return `${this.properties['padding-top'].value} ${
					this.properties['padding-right']?.value || ''
				} ${
					this.properties['padding-top'].value !== this.properties['padding-bottom']?.value
						? this.properties['padding-bottom']?.value || ''
						: ''
				} ${
					this.properties['padding-right'].value !== this.properties['padding-left']?.value
						? this.properties['padding-left']?.value || ''
						: ''
				}`
					.replace(/  /g, '')
					.trim();
			case 'border':
				if (
					!this.properties['border-top-width']?.value ||
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
				return `${this.properties['border-top-width'].value} ${
					this.properties['border-top-style']?.value || ''
				} ${this.properties['border-top-color']?.value || ''}`
					.replace(/  /g, '')
					.trim();
			case 'border-left':
				if (!this.properties['border-left-width']?.value) {
					return '';
				}
				return `${this.properties['border-left-width'].value} ${
					this.properties['border-left-style']?.value || ''
				} ${this.properties['border-left-color']?.value || ''}`
					.replace(/  /g, '')
					.trim();
			case 'border-right':
				if (!this.properties['border-right-width']?.value) {
					return '';
				}
				return `${this.properties['border-right-width'].value} ${
					this.properties['border-right-style']?.value || ''
				} ${this.properties['border-right-color']?.value || ''}`
					.replace(/  /g, '')
					.trim();
			case 'border-top':
				if (!this.properties['border-top-width']?.value) {
					return '';
				}
				return `${this.properties['border-top-width'].value} ${
					this.properties['border-top-style']?.value || ''
				} ${this.properties['border-top-color']?.value || ''}`
					.replace(/  /g, '')
					.trim();
			case 'border-bottom':
				if (!this.properties['border-bottom-width']?.value) {
					return '';
				}
				return `${this.properties['border-bottom-width'].value} ${
					this.properties['border-bottom-style']?.value || ''
				} ${this.properties['border-bottom-color']?.value || ''}`
					.replace(/  /g, '')
					.trim();
			case 'border-color':
				if (
					!this.properties['border-top-color']?.value ||
					this.properties['border-top-color']?.value !==
						this.properties['border-right-color']?.value ||
					this.properties['border-top-color']?.value !==
						this.properties['border-bottom-color']?.value ||
					this.properties['border-top-color']?.value !== this.properties['border-left-color']?.value
				) {
					return '';
				}
				return this.properties['border-top-color'].value;
			case 'border-style':
				if (
					!this.properties['border-top-style']?.value ||
					this.properties['border-top-style']?.value !==
						this.properties['border-right-style']?.value ||
					this.properties['border-top-style']?.value !==
						this.properties['border-bottom-style']?.value ||
					this.properties['border-top-style']?.value !== this.properties['border-left-style']?.value
				) {
					return '';
				}
				return this.properties['border-top-style'].value;
			case 'border-width':
				if (
					!this.properties['border-top-width']?.value ||
					this.properties['border-top-width']?.value !==
						this.properties['border-right-width']?.value ||
					this.properties['border-top-width']?.value !==
						this.properties['border-bottom-width']?.value ||
					this.properties['border-top-width']?.value !== this.properties['border-left-width']?.value
				) {
					return '';
				}
				return this.properties['border-top-width'].value;
			case 'border-radius':
				if (!this.properties['border-top-left-radius']?.value) {
					return '';
				}
				return `${this.properties['border-top-left-radius'].value} ${
					this.properties['border-top-right-radius'].value || ''
				} ${
					this.properties['border-top-left-radius'].value !==
					this.properties['border-bottom-right-radius'].value
						? this.properties['border-bottom-right-radius'].value || ''
						: ''
				} ${
					this.properties['border-top-right-radius'].value !==
					this.properties['border-bottom-left-radius'].value
						? this.properties['border-bottom-left-radius'].value || ''
						: ''
				}`
					.replace(/  /g, '')
					.trim();
			case 'background':
				if (
					!this.properties['background-color']?.value &&
					!this.properties['background-image']?.value
				) {
					return '';
				}
				return `${this.properties['background-color']?.value || ''} ${
					this.properties['background-image']?.value || ''
				} ${this.properties['background-repeat']?.value || ''} ${
					this.properties['background-repeat']?.value
						? this.properties['background-attachment']?.value || ''
						: ''
				} ${
					this.properties['background-repeat']?.value &&
					this.properties['background-attachment']?.value
						? this.properties['background-position']?.value || ''
						: ''
				}`
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
			case 'font':
				if (this.properties['font']?.value) {
					return this.properties['font'].value;
				}
				if (!this.properties['font-family']?.value) {
					return '';
				}
				return `${this.properties['font-family'].value} ${
					this.properties['font-size'].value || ''
				} ${this.properties['font-style'].value || ''} ${
					this.properties['font-weight'].value || ''
				}`
					.replace(/  /g, '')
					.trim();
		}

		return this.properties[name]?.value || '';
	}

	/**
	 * Removes a property.
	 *
	 * @param name Property name.
	 */
	public remove(name: string): void {
		switch (name) {
			case 'border':
				delete this.properties['border-top-width'];
				delete this.properties['border-right-width'];
				delete this.properties['border-bottom-width'];
				delete this.properties['border-left-width'];
				delete this.properties['border-top-style'];
				delete this.properties['border-right-style'];
				delete this.properties['border-bottom-style'];
				delete this.properties['border-left-style'];
				delete this.properties['border-top-color'];
				delete this.properties['border-right-color'];
				delete this.properties['border-bottom-color'];
				delete this.properties['border-left-color'];
				break;
			case 'border-left':
				delete this.properties['border-left-width'];
				delete this.properties['border-left-style'];
				delete this.properties['border-left-color'];
				break;
			case 'border-bottom':
				delete this.properties['border-bottom-width'];
				delete this.properties['border-bottom-style'];
				delete this.properties['border-bottom-color'];
				break;
			case 'border-right':
				delete this.properties['border-right-width'];
				delete this.properties['border-right-style'];
				delete this.properties['border-right-color'];
				break;
			case 'border-top':
				delete this.properties['border-top-width'];
				delete this.properties['border-top-style'];
				delete this.properties['border-top-color'];
				break;
			case 'border-width':
				delete this.properties['border-top-width'];
				delete this.properties['border-right-width'];
				delete this.properties['border-bottom-width'];
				delete this.properties['border-left-width'];
				break;
			case 'border-style':
				delete this.properties['border-top-style'];
				delete this.properties['border-right-style'];
				delete this.properties['border-bottom-style'];
				delete this.properties['border-left-style'];
				break;
			case 'border-color':
				delete this.properties['border-top-color'];
				delete this.properties['border-right-color'];
				delete this.properties['border-bottom-color'];
				delete this.properties['border-left-color'];
				break;
			case 'border-radius':
				delete this.properties['border-top-left-radius'];
				delete this.properties['border-top-right-radius'];
				delete this.properties['border-bottom-right-radius'];
				delete this.properties['border-bottom-left-radius'];
				break;
			case 'background':
				delete this.properties['background-color'];
				delete this.properties['background-image'];
				delete this.properties['background-repeat'];
				delete this.properties['background-attachment'];
				delete this.properties['background-position'];
				break;
			case 'flex':
				delete this.properties['flex-grow'];
				delete this.properties['flex-shrink'];
				delete this.properties['flex-basis'];
				break;
			case 'padding':
				delete this.properties['padding-top'];
				delete this.properties['padding-right'];
				delete this.properties['padding-bottom'];
				delete this.properties['padding-left'];
				break;
			case 'margin':
				delete this.properties['margin-top'];
				delete this.properties['margin-right'];
				delete this.properties['margin-bottom'];
				delete this.properties['margin-left'];
				break;
			default:
				delete this.properties[name];
				break;
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
		let properties = null;

		switch (name) {
			case 'border':
				properties = CSSStyleDeclarationPropertyValueParser.getBorder(value, important);
				break;
			case 'border-top':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTop(value, important);
				break;
			case 'border-right':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderRight(value, important);
				break;
			case 'border-bottom':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottom(value, important);
				break;
			case 'border-left':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderLeft(value, important);
				break;
			case 'border-width':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderWidth(value, important);
				break;
			case 'border-style':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderStyle(value, important);
				break;
			case 'border-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderColor(value, important);
				break;
			case 'border-top-width':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTopWidth(value, important);
				break;
			case 'border-right-width':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderRightWidth(value, important);
				break;
			case 'border-bottom-width':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottomWidth(value, important);
				break;
			case 'border-left-width':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderLeftWidth(value, important);
				break;
			case 'border-top-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTopColor(value, important);
				break;
			case 'border-right-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderRightColor(value, important);
				break;
			case 'border-bottom-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottomColor(value, important);
				break;
			case 'border-left-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderLeftColor(value, important);
				break;
			case 'border-top-style':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTopStyle(value, important);
				break;
			case 'border-right-style':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderRightStyle(value, important);
				break;
			case 'border-bottom-style':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottomStyle(value, important);
				break;
			case 'border-left-style':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderLeftStyle(value, important);
				break;
			case 'border-radius':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderRadius(value, important);
				break;
			case 'border-top-left-radius':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTopLeftRadius(
					value,
					important
				);
				break;
			case 'border-top-right-radius':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderTopRightRadius(
					value,
					important
				);
				break;
			case 'border-bottom-right-radius':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottomRightRadius(
					value,
					important
				);
				break;
			case 'border-bottom-right-radius':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderBottomLeftRadius(
					value,
					important
				);
				break;
			case 'border-collapse':
				properties = CSSStyleDeclarationPropertyValueParser.getBorderCollapse(value, important);
				break;
			case 'clear':
				properties = CSSStyleDeclarationPropertyValueParser.getClear(value, important);
				break;
			case 'clip':
				properties = CSSStyleDeclarationPropertyValueParser.getClip(value, important);
				break;
			case 'css-float':
				properties = CSSStyleDeclarationPropertyValueParser.getCSSFloat(value, important);
				break;
			case 'float':
				properties = CSSStyleDeclarationPropertyValueParser.getFloat(value, important);
				break;
			case 'flex':
				properties = CSSStyleDeclarationPropertyValueParser.getFlex(value, important);
				break;
			case 'flex-shrink':
				properties = CSSStyleDeclarationPropertyValueParser.getFlexShrink(value, important);
				break;
			case 'flex-grow':
				properties = CSSStyleDeclarationPropertyValueParser.getFlexGrow(value, important);
				break;
			case 'flex-basis':
				properties = CSSStyleDeclarationPropertyValueParser.getFlexBasis(value, important);
				break;
			case 'padding':
				properties = CSSStyleDeclarationPropertyValueParser.getPadding(value, important);
				break;
			case 'padding-top':
				properties = CSSStyleDeclarationPropertyValueParser.getPaddingTop(value, important);
				break;
			case 'padding-bottom':
				properties = CSSStyleDeclarationPropertyValueParser.getPaddingBottom(value, important);
				break;
			case 'padding-left':
				properties = CSSStyleDeclarationPropertyValueParser.getPaddingLeft(value, important);
				break;
			case 'padding-right':
				properties = CSSStyleDeclarationPropertyValueParser.getPaddingRight(value, important);
				break;
			case 'margin':
				properties = CSSStyleDeclarationPropertyValueParser.getMargin(value, important);
				break;
			case 'margin-top':
				properties = CSSStyleDeclarationPropertyValueParser.getMarginTop(value, important);
				break;
			case 'margin-bottom':
				properties = CSSStyleDeclarationPropertyValueParser.getMarginBottom(value, important);
				break;
			case 'margin-left':
				properties = CSSStyleDeclarationPropertyValueParser.getMarginLeft(value, important);
				break;
			case 'margin-right':
				properties = CSSStyleDeclarationPropertyValueParser.getMarginRight(value, important);
				break;
			case 'background':
				properties = CSSStyleDeclarationPropertyValueParser.getBackground(value, important);
				break;
			case 'background-image':
				properties = CSSStyleDeclarationPropertyValueParser.getBackgroundImage(value, important);
				break;
			case 'background-color':
				properties = CSSStyleDeclarationPropertyValueParser.getBackgroundColor(value, important);
				break;
			case 'background-repeat':
				properties = CSSStyleDeclarationPropertyValueParser.getBackgroundRepeat(value, important);
				break;
			case 'background-attachment':
				properties = CSSStyleDeclarationPropertyValueParser.getBackgroundAttachment(
					value,
					important
				);
				break;
			case 'background-position':
				properties = CSSStyleDeclarationPropertyValueParser.getBackgroundPosition(value, important);
				break;
			case 'top':
				properties = CSSStyleDeclarationPropertyValueParser.getTop(value, important);
				break;
			case 'right':
				properties = CSSStyleDeclarationPropertyValueParser.getRight(value, important);
				break;
			case 'bottom':
				properties = CSSStyleDeclarationPropertyValueParser.getBottom(value, important);
				break;
			case 'left':
				properties = CSSStyleDeclarationPropertyValueParser.getLeft(value, important);
				break;
			case 'font':
				properties = CSSStyleDeclarationPropertyValueParser.getFont(value, important);
				break;
			case 'font-size':
				properties = CSSStyleDeclarationPropertyValueParser.getFontSize(value, important);
				break;
			case 'color':
				properties = CSSStyleDeclarationPropertyValueParser.getColor(value, important);
				break;
			case 'flood-color':
				properties = CSSStyleDeclarationPropertyValueParser.getFloodColor(value, important);
				break;
			default:
				properties = value
					? {
							[name]: { value, important }
					  }
					: null;
				break;
		}

		Object.assign(this.properties, properties);
	}
}
