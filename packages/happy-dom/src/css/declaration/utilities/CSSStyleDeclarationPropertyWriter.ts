import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationValueParser from './CSSStyleDeclarationValueParser';
import CSSStyleDeclarationPropertyWriterPropertyNames from './CSSStyleDeclarationPropertyWriterPropertyNames';

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyWriter {
	private properties: {
		[k: string]: ICSSStyleDeclarationProperty;
	};

	/**
	 * Class construtor.
	 *
	 * @param properties Properties.
	 */
	constructor(properties: { [k: string]: ICSSStyleDeclarationProperty }) {
		this.properties = properties;
	}

	/**
	 * Removes a property.
	 *
	 * @param name Property name.
	 */
	public remove(name: string): void {
		if (CSSStyleDeclarationPropertyWriterPropertyNames[name]) {
			for (const propertyName of CSSStyleDeclarationPropertyWriterPropertyNames[name]) {
				delete this.properties[propertyName];
			}
		} else {
			delete this.properties[name];
		}
	}

	/**
	 * Sets a property.
	 *
	 * @param property Property.
	 */
	public set(property: ICSSStyleDeclarationProperty): void {
		const properties = this.getProperties(property);
		for (const name of Object.keys(properties)) {
			this.properties[name] = properties[name];
		}
	}

	/**
	 * Returns properties to set.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, important } = property;
		let { value } = property;

		switch (name) {
			case 'border':
				return this.getBorderProperties(property);
			case 'border-left':
			case 'border-bottom':
			case 'border-right':
			case 'border-top':
				return this.getBorderPositionProperties(property);
			case 'border-width':
				value = CSSStyleDeclarationValueParser.getBorderWidth(value);
				return value
					? {
							'border-top-width': { name, important, value },
							'border-right-width': { name, important, value },
							'border-bottom-width': { name, important, value },
							'border-left-width': { name, important, value }
					  }
					: {};
			case 'border-style':
				value = CSSStyleDeclarationValueParser.getBorderStyle(value);
				return value
					? {
							'border-top-style': { name, important, value },
							'border-right-style': { name, important, value },
							'border-bottom-style': { name, important, value },
							'border-left-style': { name, important, value }
					  }
					: {};
			case 'border-color':
				value = CSSStyleDeclarationValueParser.getBorderCollapse(value);
				return value
					? {
							'border-top-color': { name, important, value },
							'border-right-color': { name, important, value },
							'border-bottom-color': { name, important, value },
							'border-left-color': { name, important, value }
					  }
					: {};
			case 'border-radius':
				return this.getBorderRadiusProperties(property);
			case 'border-collapse':
				value = CSSStyleDeclarationValueParser.getBorderCollapse(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'clear':
				value = CSSStyleDeclarationValueParser.getClear(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'clip':
				value = CSSStyleDeclarationValueParser.getClip(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'css-float':
			case 'float':
				value = CSSStyleDeclarationValueParser.getFloat(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'flex':
				return this.getFlexProperties(property);
			case 'flex-shrink':
			case 'flex-grow':
				value = CSSStyleDeclarationValueParser.getInteger(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'flex-basis':
				value = CSSStyleDeclarationValueParser.getFlexBasis(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'padding':
				return this.getPaddingProperties(property);
			case 'margin':
				return this.getMarginProperties(property);
			case 'background':
				return this.getBackgroundProperties(property);
			case 'top':
			case 'right':
			case 'bottom':
			case 'left':
				value = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'padding-top':
			case 'padding-bottom':
			case 'padding-left':
			case 'padding-right':
				value = CSSStyleDeclarationValueParser.getMeasurement(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'margin-top':
			case 'margin-bottom':
			case 'margin-left':
			case 'margin-right':
				value = CSSStyleDeclarationValueParser.getMargin(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'border-top-width':
			case 'border-bottom-width':
			case 'border-left-width':
			case 'border-right-width':
				value = CSSStyleDeclarationValueParser.getBorderWidth(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'font-size':
				value = CSSStyleDeclarationValueParser.getFontSize(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'color':
			case 'flood-color':
			case 'border-top-color':
			case 'border-bottom-color':
			case 'border-left-color':
			case 'border-right-color':
				value = CSSStyleDeclarationValueParser.getColor(value);
				return value ? { [name]: { name, important, value } } : {};
			case 'border-top-style':
			case 'border-bottom-style':
			case 'border-left-style':
			case 'border-right-style':
				value = CSSStyleDeclarationValueParser.getBorderStyle(value);
				return value ? { [name]: { name, important, value } } : {};
		}

		return {
			[name]: { name, important, value }
		};
	}

	/**
	 * Returns border properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getBorderProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);

		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getBorderWidth(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getBorderStyle(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';

		if (!parts[0] || parts[1] === null || parts[2] === null) {
			return {};
		}

		return {
			'border-top-width': { name, important, value: parts[0] },
			'border-right-width': { name, important, value: parts[0] },
			'border-bottom-width': { name, important, value: parts[0] },
			'border-left-width': { name, important, value: parts[0] },
			'border-top-style': { name, important, value: parts[1] },
			'border-right-style': { name, important, value: parts[1] },
			'border-bottom-style': { name, important, value: parts[1] },
			'border-left-style': { name, important, value: parts[1] },
			'border-top-color': { name, important, value: parts[2] },
			'border-right-color': { name, important, value: parts[2] },
			'border-bottom-color': { name, important, value: parts[2] },
			'border-left-color': { name, important, value: parts[2] }
		};
	}

	/**
	 * Returns border radius properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getBorderRadiusProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);
		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		parts[3] = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';
		if (!parts[0] || parts[1] === null || parts[2] === null || parts[3] === null) {
			return {};
		}
		return {
			'border-top-left-radius': { name, important, value: parts[0] },
			'border-top-right-radius': { name, important, value: parts[1] },
			'border-bottom-right-radius': { name, important, value: parts[2] },
			'border-bottom-left-radius': { name, important, value: parts[3] }
		};
	}

	/**
	 * Returns border position properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getBorderPositionProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);
		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getBorderWidth(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getBorderStyle(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getColor(parts[2]) : '';

		if (!parts[0] || parts[1] === null || parts[2] === null) {
			return {};
		}

		const borderName = name.split('-')[1];

		return {
			[`border-${borderName}-width`]: { name, important, value: parts[0] },
			[`border-${borderName}-style`]: { name, important, value: parts[1] },
			[`border-${borderName}-color`]: { name, important, value: parts[2] }
		};
	}

	/**
	 * Returns padding properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getPaddingProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);
		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		parts[3] = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';

		if (!parts[0] || parts[1] === null || parts[2] === null || parts[3] === null) {
			return {};
		}

		return {
			['padding-top']: { name, important, value: parts[0] },
			['padding-right']: { name, important, value: parts[1] },
			['padding-bottom']: { name, important, value: parts[2] },
			['padding-left']: { name, important, value: parts[3] }
		};
	}

	/**
	 * Returns margin properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getMarginProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);
		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		parts[3] = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';

		if (!parts[0] || parts[1] === null || parts[2] === null || parts[3] === null) {
			return {};
		}

		return {
			['padding-top']: { name, important, value: parts[0] },
			['padding-right']: { name, important, value: parts[1] },
			['padding-bottom']: { name, important, value: parts[2] },
			['padding-left']: { name, important, value: parts[3] }
		};
	}

	/**
	 * Returns flex properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getFlexProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const lowerValue = value.trim().toLowerCase();
		switch (lowerValue) {
			case 'none':
				return {
					'flex-grow': { name, important, value: '0' },
					'flex-shrink': { name, important, value: '0' },
					'flex-basis': { name, important, value: 'auto' }
				};
			case 'auto':
				return {
					'flex-grow': { name, important, value: '1' },
					'flex-shrink': { name, important, value: '1' },
					'flex-basis': { name, important, value: 'auto' }
				};
			case 'initial':
				return {
					'flex-grow': { name, important, value: '0' },
					'flex-shrink': { name, important, value: '1' },
					'flex-basis': { name, important, value: 'auto' }
				};
			case 'inherit':
				return {
					'flex-grow': { name, important, value: 'inherit' },
					'flex-shrink': { name, important, value: 'inherit' },
					'flex-basis': { name, important, value: 'inherit' }
				};
		}

		const parts = value.split(/ +/);
		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getInteger(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getInteger(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getFlexBasis(parts[2]) : '';

		if (!parts[0] || !parts[1] || !parts[2]) {
			return {};
		}

		return {
			'flex-grow': { name, important, value: parts[0] },
			'flex-shrink': { name, important, value: parts[1] },
			'flex-basis': { name, important, value: parts[2] }
		};
	}

	/**
	 * Returns background properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	private getBackgroundProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		const parts = value.split(/ +/);

		if (!parts[0]) {
			return {};
		}

		// First value can be color or image url
		if (!CSSStyleDeclarationValueParser.getColor(parts[0])) {
			parts.unshift('');
		}

		parts[0] = parts[0] ? CSSStyleDeclarationValueParser.getColor(parts[0]) : '';
		parts[1] = parts[1] ? CSSStyleDeclarationValueParser.getURL(parts[1]) : '';
		parts[2] = parts[2] ? CSSStyleDeclarationValueParser.getBackgroundRepeat(parts[2]) : '';
		parts[3] = parts[3] ? CSSStyleDeclarationValueParser.getBackgroundAttachment(parts[3]) : '';
		parts[4] = parts[4] ? CSSStyleDeclarationValueParser.getBackgroundPosition(parts[4]) : '';
		if ((!parts[0] && !parts[1]) || parts[2] === null || parts[3] === null || parts[4] === null) {
			return {};
		}

		return {
			'background-color': { name, important, value: parts[0] },
			'background-image': { name, important, value: parts[1] },
			'background-repeat': { name, important, value: parts[2] },
			'background-attachment': { name, important, value: parts[3] },
			'background-position': { name, important, value: parts[4] }
		};
	}
}
