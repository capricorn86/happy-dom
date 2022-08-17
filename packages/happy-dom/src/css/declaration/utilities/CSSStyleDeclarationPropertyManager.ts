import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';
import CSSStyleDeclarationValueParser from './CSSStyleDeclarationPropertyValueParser';
import CSSStyleDeclarationPropertyManagerPropertyNames from './CSSStyleDeclarationPropertyManagerPropertyNames';
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
		let propertyValues = null;

		switch (name) {
			case 'border':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorder(value, important);
				break;
			case 'border-top':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderTop(value, important);
				break;
			case 'border-left':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderLeft(value, important);
				break;
			case 'border-bottom':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderBottom(value, important);
				break;
			case 'border-right':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderRight(value, important);
				break;
			case 'border-width':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderWidth(value, important);
				break;
			case 'border-style':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderStyle(value, important);
				break;
			case 'border-color':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderCollapse(value, important);
				break;
			case 'border-radius':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderRadius(value, important);
				break;
			case 'border-collapse':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderCollapse(value, important);
				break;
			case 'clear':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getClear(value, important);
				break;
			case 'clip':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getClip(value, important);
				break;
			case 'css-float':
			case 'float':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getFloat(value, important);
				break;
			case 'flex':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getFlex(value, important);
				break;
			case 'flex-shrink':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getFlexShrink(value, important);
				break;
			case 'flex-grow':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getFlexGrow(value, important);
				break;
			case 'flex-basis':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getFlexBasis(value, important);
				break;
			case 'padding':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getPadding(value, important);
				break;
			case 'margin':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getMargin(value, important);
				break;
			case 'background':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBackground(value, important);
				break;
			case 'top':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getTop(value, important);
				break;
			case 'right':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getRight(value, important);
				break;
			case 'bottom':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBottom(value, important);
				break;
			case 'left':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getLeft(value, important);
				break;
			case 'padding-top':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getPaddingTop(value, important);
				break;
			case 'padding-bottom':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getPaddingBottom(value, important);
				break;
			case 'padding-left':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getPaddingLeft(value, important);
				break;
			case 'padding-right':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getPaddingRight(value, important);
				break;
			case 'margin-top':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getMarginTop(value, important);
				break;
			case 'margin-bottom':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getMarginBottom(value, important);
				break;
			case 'margin-left':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getMarginLeft(value, important);
				break;
			case 'margin-right':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getMarginRight(value, important);
				break;
			case 'border-top-width':
				propertyValues = CSSStyleDeclarationPropertyValueParser.getBorderTopWidth(value, important);
				break;
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
	 * Reads a string.
	 *
	 * @param styleString Style string (e.g. "border: 2px solid red; font-size: 12px;").
	 */
	private fromString(styleString: string): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {}
}
