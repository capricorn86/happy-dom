import type ICSSPropertyValue from './types/ICSSPropertyValue.js';
import CSSPropertySetParser from './parsers/CSSPropertySetParser.js';
import CSSPropertyGetParser from './parsers/CSSPropertyGetParser.js';
import CSSTextParser from '../utilities/CSSTextParser.js';
import type ICSSPropertyMap from './types/ICSSPropertyMap.js';
import CSSPropertyList from '../CSSPropertyList.js';

const TO_STRING_SHORTHAND_PROPERTIES = [
	['margin'],
	['padding'],
	['border', ['border-width', 'border-style', 'border-color', 'border-image']],
	['border-radius'],
	['background', 'background-position'],
	['font']
];

/**
 * CSS property manager.
 */
export default class CSSPropertyManager {
	public properties: ICSSPropertyMap = {};
	private definedPropertyNames: { [k: string]: boolean } = {};

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.cssText] CSS string.
	 */
	constructor(options?: { cssText?: string }) {
		if (options?.cssText) {
			const { rules } = CSSTextParser.parse(options.cssText);
			for (const rule of rules) {
				if (rule.important || !this.get(rule.name)?.important) {
					this.set(rule.name, rule.value, rule.important);
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
	public get(name: string): ICSSPropertyValue | null {
		if (this.properties[name]) {
			return this.properties[name];
		}
		switch (name) {
			case 'margin':
				return CSSPropertyGetParser.getMargin(this.properties);
			case 'padding':
				return CSSPropertyGetParser.getPadding(this.properties);
			case 'border':
				return CSSPropertyGetParser.getBorder(this.properties);
			case 'border-top':
				return CSSPropertyGetParser.getBorderTop(this.properties);
			case 'border-right':
				return CSSPropertyGetParser.getBorderRight(this.properties);
			case 'border-bottom':
				return CSSPropertyGetParser.getBorderBottom(this.properties);
			case 'border-left':
				return CSSPropertyGetParser.getBorderLeft(this.properties);
			case 'border-color':
				return CSSPropertyGetParser.getBorderColor(this.properties);
			case 'border-style':
				return CSSPropertyGetParser.getBorderStyle(this.properties);
			case 'border-width':
				return CSSPropertyGetParser.getBorderWidth(this.properties);
			case 'border-radius':
				return CSSPropertyGetParser.getBorderRadius(this.properties);
			case 'border-image':
				return CSSPropertyGetParser.getBorderImage(this.properties);
			case 'outline':
				return CSSPropertyGetParser.getOutline(this.properties);
			case 'background':
				return CSSPropertyGetParser.getBackground(this.properties);
			case 'background-position':
				return CSSPropertyGetParser.getBackgroundPosition(this.properties);
			case 'flex':
				return CSSPropertyGetParser.getFlex(this.properties);
			case 'font':
				return CSSPropertyGetParser.getFont(this.properties);
		}

		return this.properties[name] || null;
	}

	/**
	 * Removes a property.
	 *
	 * @param name Property name.
	 */
	public remove(name: string): void {
		delete this.properties[name];
		delete this.definedPropertyNames[name];

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
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
				break;
			case 'border-top':
				delete this.properties['border-top-width'];
				delete this.properties['border-top-style'];
				delete this.properties['border-top-color'];
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
				break;
			case 'border-right':
				delete this.properties['border-right-width'];
				delete this.properties['border-right-style'];
				delete this.properties['border-right-color'];
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
				break;
			case 'border-bottom':
				delete this.properties['border-bottom-width'];
				delete this.properties['border-bottom-style'];
				delete this.properties['border-bottom-color'];
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
				break;
			case 'border-left':
				delete this.properties['border-left-width'];
				delete this.properties['border-left-style'];
				delete this.properties['border-left-color'];
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
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
			case 'border-image':
				delete this.properties['border-image-source'];
				delete this.properties['border-image-slice'];
				delete this.properties['border-image-width'];
				delete this.properties['border-image-outset'];
				delete this.properties['border-image-repeat'];
				break;
			case 'border-radius':
				delete this.properties['border-top-left-radius'];
				delete this.properties['border-top-right-radius'];
				delete this.properties['border-bottom-right-radius'];
				delete this.properties['border-bottom-left-radius'];
				break;
			case 'outline':
				delete this.properties['outline-color'];
				delete this.properties['outline-style'];
				delete this.properties['outline-width'];
				break;
			case 'background':
				delete this.properties['background-color'];
				delete this.properties['background-image'];
				delete this.properties['background-repeat'];
				delete this.properties['background-attachment'];
				delete this.properties['background-position-x'];
				delete this.properties['background-position-y'];
				delete this.properties['background-size'];
				delete this.properties['background-origin'];
				delete this.properties['background-clip'];
				break;
			case 'background-position':
				delete this.properties['background-position-x'];
				delete this.properties['background-position-y'];
				break;
			case 'flex':
				delete this.properties['flex-grow'];
				delete this.properties['flex-shrink'];
				delete this.properties['flex-basis'];
				break;
			case 'font':
				delete this.properties['font-style'];
				delete this.properties['font-variant'];
				delete this.properties['font-weight'];
				delete this.properties['font-stretch'];
				delete this.properties['font-size'];
				delete this.properties['line-height'];
				delete this.properties['font-family'];
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
		if (value === null) {
			this.remove(name);
			return;
		}

		let properties = null;

		switch (name) {
			case 'border':
				properties = CSSPropertySetParser.getBorder(value, important);
				break;
			case 'border-top':
				properties = CSSPropertySetParser.getBorderTop(value, important);
				break;
			case 'border-right':
				properties = CSSPropertySetParser.getBorderRight(value, important);
				break;
			case 'border-bottom':
				properties = CSSPropertySetParser.getBorderBottom(value, important);
				break;
			case 'border-left':
				properties = CSSPropertySetParser.getBorderLeft(value, important);
				break;
			case 'border-width':
				properties = CSSPropertySetParser.getBorderWidth(value, important);
				break;
			case 'border-style':
				properties = CSSPropertySetParser.getBorderStyle(value, important);
				break;
			case 'border-color':
				properties = CSSPropertySetParser.getBorderColor(value, important);
				break;
			case 'border-image':
				properties = CSSPropertySetParser.getBorderImage(value, important);
				break;
			case 'border-image-source':
				properties = CSSPropertySetParser.getBorderImageSource(value, important);
				break;
			case 'border-image-slice':
				properties = CSSPropertySetParser.getBorderImageSlice(value, important);
				break;
			case 'border-image-width':
				properties = CSSPropertySetParser.getBorderImageWidth(value, important);
				break;
			case 'border-image-outset':
				properties = CSSPropertySetParser.getBorderImageOutset(value, important);
				break;
			case 'border-image-repeat':
				properties = CSSPropertySetParser.getBorderImageRepeat(value, important);
				break;
			case 'border-top-width':
				properties = CSSPropertySetParser.getBorderTopWidth(value, important);
				break;
			case 'border-right-width':
				properties = CSSPropertySetParser.getBorderRightWidth(value, important);
				break;
			case 'border-bottom-width':
				properties = CSSPropertySetParser.getBorderBottomWidth(value, important);
				break;
			case 'border-left-width':
				properties = CSSPropertySetParser.getBorderLeftWidth(value, important);
				break;
			case 'border-top-color':
				properties = CSSPropertySetParser.getBorderTopColor(value, important);
				break;
			case 'border-right-color':
				properties = CSSPropertySetParser.getBorderRightColor(value, important);
				break;
			case 'border-bottom-color':
				properties = CSSPropertySetParser.getBorderBottomColor(value, important);
				break;
			case 'border-left-color':
				properties = CSSPropertySetParser.getBorderLeftColor(value, important);
				break;
			case 'border-top-style':
				properties = CSSPropertySetParser.getBorderTopStyle(value, important);
				break;
			case 'border-right-style':
				properties = CSSPropertySetParser.getBorderRightStyle(value, important);
				break;
			case 'border-bottom-style':
				properties = CSSPropertySetParser.getBorderBottomStyle(value, important);
				break;
			case 'border-left-style':
				properties = CSSPropertySetParser.getBorderLeftStyle(value, important);
				break;
			case 'border-radius':
				properties = CSSPropertySetParser.getBorderRadius(value, important);
				break;
			case 'border-top-left-radius':
				properties = CSSPropertySetParser.getBorderTopLeftRadius(value, important);
				break;
			case 'border-top-right-radius':
				properties = CSSPropertySetParser.getBorderTopRightRadius(value, important);
				break;
			case 'border-bottom-right-radius':
				properties = CSSPropertySetParser.getBorderBottomRightRadius(value, important);
				break;
			case 'border-bottom-left-radius':
				properties = CSSPropertySetParser.getBorderBottomLeftRadius(value, important);
				break;
			case 'border-collapse':
				properties = CSSPropertySetParser.getBorderCollapse(value, important);
				break;
			case 'outline':
				properties = CSSPropertySetParser.getOutline(value, important);
				break;
			case 'outline-width':
				properties = CSSPropertySetParser.getOutlineWidth(value, important);
				break;
			case 'outline-style':
				properties = CSSPropertySetParser.getOutlineStyle(value, important);
				break;
			case 'outline-color':
				properties = CSSPropertySetParser.getOutlineColor(value, important);
				break;
			case 'letter-spacing':
				properties = CSSPropertySetParser.getLetterSpacing(value, important);
				break;
			case 'word-spacing':
				properties = CSSPropertySetParser.getWordSpacing(value, important);
				break;
			case 'clear':
				properties = CSSPropertySetParser.getClear(value, important);
				break;
			case 'clip':
				properties = CSSPropertySetParser.getClip(value, important);
				break;
			case 'css-float':
				properties = CSSPropertySetParser.getCSSFloat(value, important);
				break;
			case 'float':
				properties = CSSPropertySetParser.getFloat(value, important);
				break;
			case 'display':
				properties = CSSPropertySetParser.getDisplay(value, important);
				break;
			case 'direction':
				properties = CSSPropertySetParser.getDirection(value, important);
				break;
			case 'flex':
				properties = CSSPropertySetParser.getFlex(value, important);
				break;
			case 'flex-shrink':
				properties = CSSPropertySetParser.getFlexShrink(value, important);
				break;
			case 'flex-grow':
				properties = CSSPropertySetParser.getFlexGrow(value, important);
				break;
			case 'flex-basis':
				properties = CSSPropertySetParser.getFlexBasis(value, important);
				break;
			case 'padding':
				properties = CSSPropertySetParser.getPadding(value, important);
				break;
			case 'padding-top':
				properties = CSSPropertySetParser.getPaddingTop(value, important);
				break;
			case 'padding-right':
				properties = CSSPropertySetParser.getPaddingRight(value, important);
				break;
			case 'padding-bottom':
				properties = CSSPropertySetParser.getPaddingBottom(value, important);
				break;
			case 'padding-left':
				properties = CSSPropertySetParser.getPaddingLeft(value, important);
				break;
			case 'margin':
				properties = CSSPropertySetParser.getMargin(value, important);
				break;
			case 'margin-top':
				properties = CSSPropertySetParser.getMarginTop(value, important);
				break;
			case 'margin-right':
				properties = CSSPropertySetParser.getMarginRight(value, important);
				break;
			case 'margin-bottom':
				properties = CSSPropertySetParser.getMarginBottom(value, important);
				break;
			case 'margin-left':
				properties = CSSPropertySetParser.getMarginLeft(value, important);
				break;
			case 'background':
				properties = CSSPropertySetParser.getBackground(value, important);
				break;
			case 'background-image':
				properties = CSSPropertySetParser.getBackgroundImage(value, important);
				break;
			case 'background-color':
				properties = CSSPropertySetParser.getBackgroundColor(value, important);
				break;
			case 'background-repeat':
				properties = CSSPropertySetParser.getBackgroundRepeat(value, important);
				break;
			case 'background-attachment':
				properties = CSSPropertySetParser.getBackgroundAttachment(value, important);
				break;
			case 'background-position':
				properties = CSSPropertySetParser.getBackgroundPosition(value, important);
				break;
			case 'width':
				properties = CSSPropertySetParser.getWidth(value, important);
				break;
			case 'height':
				properties = CSSPropertySetParser.getHeight(value, important);
				break;
			case 'top':
				properties = CSSPropertySetParser.getTop(value, important);
				break;
			case 'right':
				properties = CSSPropertySetParser.getRight(value, important);
				break;
			case 'bottom':
				properties = CSSPropertySetParser.getBottom(value, important);
				break;
			case 'left':
				properties = CSSPropertySetParser.getLeft(value, important);
				break;
			case 'font':
				properties = CSSPropertySetParser.getFont(value, important);
				break;
			case 'font-style':
				properties = CSSPropertySetParser.getFontStyle(value, important);
				break;
			case 'font-variant':
				properties = CSSPropertySetParser.getFontVariant(value, important);
				break;
			case 'font-weight':
				properties = CSSPropertySetParser.getFontWeight(value, important);
				break;
			case 'font-stretch':
				properties = CSSPropertySetParser.getFontStretch(value, important);
				break;
			case 'font-size':
				properties = CSSPropertySetParser.getFontSize(value, important);
				break;
			case 'line-height':
				properties = CSSPropertySetParser.getLineHeight(value, important);
				break;
			case 'text-indent':
				properties = CSSPropertySetParser.getTextIndent(value, important);
				break;
			case 'font-family':
				properties = CSSPropertySetParser.getFontFamily(value, important);
				break;
			case 'color':
				properties = CSSPropertySetParser.getColor(value, important);
				break;
			case 'flood-color':
				properties = CSSPropertySetParser.getFloodColor(value, important);
				break;
			case 'text-transform':
				properties = CSSPropertySetParser.getTextTransform(value, important);
				break;
			case 'visibility':
				properties = CSSPropertySetParser.getVisibility(value, important);
				break;
			case 'aspect-ratio':
				properties = CSSPropertySetParser.getAspectRatio(value, important);
				break;
			default:
				//  If the property name starts with '--', it's a CSS variable
				if ((name[0] === '-' && name[1] === '-') || CSSPropertyList.kebabCase[<'color'>name]) {
					properties = CSSPropertySetParser.getDefault(name, value, important);
				}
				break;
		}

		if (properties !== null && Object.keys(properties).length > 0) {
			this.definedPropertyNames[name] = true;
			Object.assign(this.properties, properties);
		}
	}

	/**
	 * Returns a clone.
	 *
	 * @returns Clone.
	 */
	public clone(): CSSPropertyManager {
		const _class = <typeof CSSPropertyManager>this.constructor;
		const clone: CSSPropertyManager = new _class();

		clone.properties = structuredClone(this.properties);
		clone.definedPropertyNames = Object.assign({}, this.definedPropertyNames);

		return clone;
	}

	/**
	 * Returns size.
	 *
	 * @returns Size.
	 */
	public size(): number {
		return Object.keys(this.properties).length;
	}

	/**
	 * Returns property name.
	 *
	 * @param index Index.
	 * @returns Property name.
	 */
	public item(index: number): string {
		return Object.keys(this.properties)[index] || '';
	}

	/**
	 * Converts properties to string.
	 *
	 * @returns String.
	 */
	public toString(): string {
		const result = [];
		const clone = this.clone();
		const properties: { [k: string]: ICSSPropertyValue } = {};

		for (const shorthandPropertyGroup of TO_STRING_SHORTHAND_PROPERTIES) {
			for (const shorthandProperty of shorthandPropertyGroup) {
				if (Array.isArray(shorthandProperty)) {
					let isMatch = false;
					for (const childShorthandProperty of shorthandProperty) {
						const property = clone.get(childShorthandProperty);
						if (property) {
							properties[childShorthandProperty] = property;
							clone.remove(childShorthandProperty);
							isMatch = true;
						}
					}
					if (isMatch) {
						break;
					}
				} else {
					const property = clone.get(shorthandProperty);
					if (property) {
						properties[shorthandProperty] = property;
						clone.remove(shorthandProperty);
						break;
					}
				}
			}
		}

		for (const name of Object.keys(clone.properties)) {
			properties[name] = clone.get(name)!;
		}

		for (const definedPropertyName of Object.keys(this.definedPropertyNames)) {
			const property = properties[definedPropertyName];
			if (property) {
				result.push(
					`${definedPropertyName}: ${property.value}${property.important ? ' !important' : ''};`
				);
				delete properties[definedPropertyName];
			}
		}

		for (const propertyName of Object.keys(properties)) {
			const property = properties[propertyName];
			if (property) {
				result.push(
					`${propertyName}: ${property.value}${property.important ? ' !important' : ''};`
				);
			}
		}

		return result.join(' ');
	}
}
