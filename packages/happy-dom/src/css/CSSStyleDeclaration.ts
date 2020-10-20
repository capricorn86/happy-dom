import CSSRule from './CSSRule';

/**
 * CSSStyleDeclaration interface.
 */
export default class CSSStyleDeclaration {
	public readonly length = 0;
	public readonly parentRule: CSSRule = null;

	// Properties
	public readonly alignContent = '';
	public readonly alignItems = '';
	public readonly alignSelf = '';
	public readonly alignmentBaseline = '';
	public readonly all = '';
	public readonly animation = '';
	public readonly animationDelay = '';
	public readonly animationDirection = '';
	public readonly animationDuration = '';
	public readonly animationFillMode = '';
	public readonly animationIterationCount = '';
	public readonly animationName = '';
	public readonly animationPlayState = '';
	public readonly animationTimingFunction = '';
	public readonly appearance = '';
	public readonly backdropFilter = '';
	public readonly backfaceVisibility = '';
	public readonly background = '';
	public readonly backgroundAttachment = '';
	public readonly backgroundBlendMode = '';
	public readonly backgroundClip = '';
	public readonly backgroundColor = '';
	public readonly backgroundImage = '';
	public readonly backgroundOrigin = '';
	public readonly backgroundPosition = '';
	public readonly backgroundPositionX = '';
	public readonly backgroundPositionY = '';
	public readonly backgroundRepeat = '';
	public readonly backgroundRepeatX = '';
	public readonly backgroundRepeatY = '';
	public readonly backgroundSize = '';
	public readonly baselineShift = '';
	public readonly blockSize = '';
	public readonly border = '';
	public readonly borderBlockEnd = '';
	public readonly borderBlockEndColor = '';
	public readonly borderBlockEndStyle = '';
	public readonly borderBlockEndWidth = '';
	public readonly borderBlockStart = '';
	public readonly borderBlockStartColor = '';
	public readonly borderBlockStartStyle = '';
	public readonly borderBlockStartWidth = '';
	public readonly borderBottom = '';
	public readonly borderBottomColor = '';
	public readonly borderBottomLeftRadius = '';
	public readonly borderBottomRightRadius = '';
	public readonly borderBottomStyle = '';
	public readonly borderBottomWidth = '';
	public readonly borderCollapse = '';
	public readonly borderColor = '';
	public readonly borderImage = '';
	public readonly borderImageOutset = '';
	public readonly borderImageRepeat = '';
	public readonly borderImageSlice = '';
	public readonly borderImageSource = '';
	public readonly borderImageWidth = '';
	public readonly borderInlineEnd = '';
	public readonly borderInlineEndColor = '';
	public readonly borderInlineEndStyle = '';
	public readonly borderInlineEndWidth = '';
	public readonly borderInlineStart = '';
	public readonly borderInlineStartColor = '';
	public readonly borderInlineStartStyle = '';
	public readonly borderInlineStartWidth = '';
	public readonly borderLeft = '';
	public readonly borderLeftColor = '';
	public readonly borderLeftStyle = '';
	public readonly borderLeftWidth = '';
	public readonly borderRadius = '';
	public readonly borderRight = '';
	public readonly borderRightColor = '';
	public readonly borderRightStyle = '';
	public readonly borderRightWidth = '';
	public readonly borderSpacing = '';
	public readonly borderStyle = '';
	public readonly borderTop = '';
	public readonly borderTopColor = '';
	public readonly borderTopLeftRadius = '';
	public readonly borderTopRightRadius = '';
	public readonly borderTopStyle = '';
	public readonly borderTopWidth = '';
	public readonly borderWidth = '';
	public readonly bottom = '';
	public readonly boxShadow = '';
	public readonly boxSizing = '';
	public readonly breakAfter = '';
	public readonly breakBefore = '';
	public readonly breakInside = '';
	public readonly bufferedRendering = '';
	public readonly captionSide = '';
	public readonly caretColor = '';
	public readonly clear = '';
	public readonly clip = '';
	public readonly clipPath = '';
	public readonly clipRule = '';
	public readonly color = '';
	public readonly colorInterpolation = '';
	public readonly colorInterpolationFilters = '';
	public readonly colorRendering = '';
	public readonly colorScheme = '';
	public readonly columnCount = '';
	public readonly columnFill = '';
	public readonly columnGap = '';
	public readonly columnRule = '';
	public readonly columnRuleColor = '';
	public readonly columnRuleStyle = '';
	public readonly columnRuleWidth = '';
	public readonly columnSpan = '';
	public readonly columnWidth = '';
	public readonly columns = '';
	public readonly contain = '';
	public readonly containIntrinsicSize = '';
	public readonly content = '';
	public readonly contentVisibility = '';
	public readonly counterIncrement = '';
	public readonly counterReset = '';
	public readonly counterSet = '';
	public readonly cssFloat = '';
	public readonly cursor = '';
	public readonly cx = '';
	public readonly cy = '';
	public readonly d = '';
	public readonly direction = '';
	public readonly display = '';
	public readonly dominantBaseline = '';
	public readonly emptyCells = '';
	public readonly fill = '';
	public readonly fillOpacity = '';
	public readonly fillRule = '';
	public readonly filter = '';
	public readonly flex = '';
	public readonly flexBasis = '';
	public readonly flexDirection = '';
	public readonly flexFlow = '';
	public readonly flexGrow = '';
	public readonly flexShrink = '';
	public readonly flexWrap = '';
	public readonly float = '';
	public readonly floodColor = '';
	public readonly floodOpacity = '';
	public readonly font = '';
	public readonly fontDisplay: 'swap';
	public readonly fontFamily: 'zillaslab';
	public readonly fontFeatureSettings = '';
	public readonly fontKerning = '';
	public readonly fontOpticalSizing = '';
	public readonly fontSize = '';
	public readonly fontStretch = '';
	public readonly fontStyle: 'normal';
	public readonly fontVariant = '';
	public readonly fontVariantCaps = '';
	public readonly fontVariantEastAsian = '';
	public readonly fontVariantLigatures = '';
	public readonly fontVariantNumeric = '';
	public readonly fontVariationSettings = '';
	public readonly fontWeight: 'normal';
	public readonly gap = '';
	public readonly grid = '';
	public readonly gridArea = '';
	public readonly gridAutoColumns = '';
	public readonly gridAutoFlow = '';
	public readonly gridAutoRows = '';
	public readonly gridColumn = '';
	public readonly gridColumnEnd = '';
	public readonly gridColumnGap = '';
	public readonly gridColumnStart = '';
	public readonly gridGap = '';
	public readonly gridRow = '';
	public readonly gridRowEnd = '';
	public readonly gridRowGap = '';
	public readonly gridRowStart = '';
	public readonly gridTemplate = '';
	public readonly gridTemplateAreas = '';
	public readonly gridTemplateColumns = '';
	public readonly gridTemplateRows = '';
	public readonly height = '';
	public readonly hyphens = '';
	public readonly imageOrientation = '';
	public readonly imageRendering = '';
	public readonly inherits = '';
	public readonly initialValue = '';
	public readonly inlineSize = '';
	public readonly isolation = '';
	public readonly justifyContent = '';
	public readonly justifyItems = '';
	public readonly justifySelf = '';
	public readonly left = '';
	public readonly letterSpacing = '';
	public readonly lightingColor = '';
	public readonly lineBreak = '';
	public readonly lineHeight = '';
	public readonly listStyle = '';
	public readonly listStyleImage = '';
	public readonly listStylePosition = '';
	public readonly listStyleType = '';
	public readonly margin = '';
	public readonly marginBlockEnd = '';
	public readonly marginBlockStart = '';
	public readonly marginBottom = '';
	public readonly marginInlineEnd = '';
	public readonly marginInlineStart = '';
	public readonly marginLeft = '';
	public readonly marginRight = '';
	public readonly marginTop = '';
	public readonly marker = '';
	public readonly markerEnd = '';
	public readonly markerMid = '';
	public readonly markerStart = '';
	public readonly mask = '';
	public readonly maskType = '';
	public readonly maxBlockSize = '';
	public readonly maxHeight = '';
	public readonly maxInlineSize = '';
	public readonly maxWidth = '';
	public readonly maxZoom = '';
	public readonly minBlockSize = '';
	public readonly minHeight = '';
	public readonly minInlineSize = '';
	public readonly minWidth = '';
	public readonly minZoom = '';
	public readonly mixBlendMode = '';
	public readonly objectFit = '';
	public readonly objectPosition = '';
	public readonly offset = '';
	public readonly offsetDistance = '';
	public readonly offsetPath = '';
	public readonly offsetRotate = '';
	public readonly opacity = '';
	public readonly order = '';
	public readonly orientation = '';
	public readonly orphans = '';
	public readonly outline = '';
	public readonly outlineColor = '';
	public readonly outlineOffset = '';
	public readonly outlineStyle = '';
	public readonly outlineWidth = '';
	public readonly overflow = '';
	public readonly overflowAnchor = '';
	public readonly overflowWrap = '';
	public readonly overflowX = '';
	public readonly overflowY = '';
	public readonly overscrollBehavior = '';
	public readonly overscrollBehaviorBlock = '';
	public readonly overscrollBehaviorInline = '';
	public readonly overscrollBehaviorX = '';
	public readonly overscrollBehaviorY = '';
	public readonly padding = '';
	public readonly paddingBlockEnd = '';
	public readonly paddingBlockStart = '';
	public readonly paddingBottom = '';
	public readonly paddingInlineEnd = '';
	public readonly paddingInlineStart = '';
	public readonly paddingLeft = '';
	public readonly paddingRight = '';
	public readonly paddingTop = '';
	public readonly page = '';
	public readonly pageBreakAfter = '';
	public readonly pageBreakBefore = '';
	public readonly pageBreakInside = '';
	public readonly pageOrientation = '';
	public readonly paintOrder = '';
	public readonly perspective = '';
	public readonly perspectiveOrigin = '';
	public readonly placeContent = '';
	public readonly placeItems = '';
	public readonly placeSelf = '';
	public readonly pointerEvents = '';
	public readonly position = '';
	public readonly quotes = '';
	public readonly r = '';
	public readonly resize = '';
	public readonly right = '';
	public readonly rowGap = '';
	public readonly rubyPosition = '';
	public readonly rx = '';
	public readonly ry = '';
	public readonly scrollBehavior = '';
	public readonly scrollMargin = '';
	public readonly scrollMarginBlock = '';
	public readonly scrollMarginBlockEnd = '';
	public readonly scrollMarginBlockStart = '';
	public readonly scrollMarginBottom = '';
	public readonly scrollMarginInline = '';
	public readonly scrollMarginInlineEnd = '';
	public readonly scrollMarginInlineStart = '';
	public readonly scrollMarginLeft = '';
	public readonly scrollMarginRight = '';
	public readonly scrollMarginTop = '';
	public readonly scrollPadding = '';
	public readonly scrollPaddingBlock = '';
	public readonly scrollPaddingBlockEnd = '';
	public readonly scrollPaddingBlockStart = '';
	public readonly scrollPaddingBottom = '';
	public readonly scrollPaddingInline = '';
	public readonly scrollPaddingInlineEnd = '';
	public readonly scrollPaddingInlineStart = '';
	public readonly scrollPaddingLeft = '';
	public readonly scrollPaddingRight = '';
	public readonly scrollPaddingTop = '';
	public readonly scrollSnapAlign = '';
	public readonly scrollSnapStop = '';
	public readonly scrollSnapType = '';
	public readonly shapeImageThreshold = '';
	public readonly shapeMargin = '';
	public readonly shapeOutside = '';
	public readonly shapeRendering = '';
	public readonly size = '';
	public readonly speak = '';
	public readonly src = '';
	public readonly stopColor = '';
	public readonly stopOpacity = '';
	public readonly stroke = '';
	public readonly strokeDasharray = '';
	public readonly strokeDashoffset = '';
	public readonly strokeLinecap = '';
	public readonly strokeLinejoin = '';
	public readonly strokeMiterlimit = '';
	public readonly strokeOpacity = '';
	public readonly strokeWidth = '';
	public readonly syntax = '';
	public readonly tabSize = '';
	public readonly tableLayout = '';
	public readonly textAlign = '';
	public readonly textAlignLast = '';
	public readonly textAnchor = '';
	public readonly textCombineUpright = '';
	public readonly textDecoration = '';
	public readonly textDecorationColor = '';
	public readonly textDecorationLine = '';
	public readonly textDecorationSkipInk = '';
	public readonly textDecorationStyle = '';
	public readonly textIndent = '';
	public readonly textOrientation = '';
	public readonly textOverflow = '';
	public readonly textRendering = '';
	public readonly textShadow = '';
	public readonly textSizeAdjust = '';
	public readonly textTransform = '';
	public readonly textUnderlinePosition = '';
	public readonly top = '';
	public readonly touchAction = '';
	public readonly transform = '';
	public readonly transformBox = '';
	public readonly transformOrigin = '';
	public readonly transformStyle = '';
	public readonly transition = '';
	public readonly transitionDelay = '';
	public readonly transitionDuration = '';
	public readonly transitionProperty = '';
	public readonly transitionTimingFunction = '';
	public readonly unicodeBidi = '';
	public readonly unicodeRange = '';
	public readonly userSelect = '';
	public readonly userZoom = '';
	public readonly vectorEffect = '';
	public readonly verticalAlign = '';
	public readonly visibility = '';
	public readonly whiteSpace = '';
	public readonly widows = '';
	public readonly width = '';
	public readonly willChange = '';
	public readonly wordBreak = '';
	public readonly wordSpacing = '';
	public readonly wordWrap = '';
	public readonly writingMode = '';
	public readonly x = '';
	public readonly y = '';
	public readonly zIndex = '';
	public readonly zoom = '';

	// Private
	private _styleMap: { [k: string]: string } = {};

	/**
	 * Returns the style decleration as a CSS text.
	 *
	 * TODO: Not implemented
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		let cssText = '';
		for (const key of Object.keys(this._styleMap)) {
			cssText += `${key}: ${this._styleMap[key]};`;
		}
		return cssText;
	}

	/**
	 * Returns item.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	public item(index: number): string {
		return this[String(index)] || '';
	}

	/**
	 * Set a property.
	 *
	 * @param propertyName Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public setProperty(propertyName: string, value: string, priority = ''): void {
		const newValue = value + (priority ? ' !' + priority : '');

		if (this._styleMap[propertyName] === undefined) {
			// @ts-ignore
			this.length++;
		}

		this[this.length - 1] = propertyName;
		this._styleMap[propertyName] = newValue;
		this[this._kebabToCamelCase(propertyName)] = newValue;
	}

	/**
	 * Removes a property.
	 *
	 * @param propertyName Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public removeProperty(propertyName: string): void {
		const currentIndex = this._styleMap[propertyName];

		if (currentIndex !== undefined) {
			// @ts-ignore
			this.length--;

			delete this[this.length];
			delete this._styleMap[propertyName];

			let index = 0;

			for (const key of Object.keys(this._styleMap[propertyName])) {
				this[index] = key;
				index++;
			}

			this[this._kebabToCamelCase(propertyName)] = '';
		}
	}

	/**
	 * Kebab case to words.
	 *
	 * @param string String to convert.
	 * @returns Text as kebab case.
	 */
	private _kebabToCamelCase(string): string {
		string = string.split('-');
		for (let i = 0, max = string.length; i < max; i++) {
			const firstWord = i > 0 ? string[i].charAt(0).toUpperCase() : string[i].charAt(0);
			string[i] = firstWord + string[i].slice(1);
		}
		return string.join('');
	}
}
