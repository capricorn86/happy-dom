import Attr from '../attribute/Attr';
import CSSRule from './CSSRule';

/**
 * CSS Style Declaration.
 */
export default class CSSStyleDeclaration {
	public readonly length = 0;
	public readonly parentRule: CSSRule = null;
	private _attributes: { [k: string]: Attr } = null;
	private _computedStyleElement: { isConnected: boolean } = null;

	/* eslint-disable require-jsdoc */

	public get alignContent(): string {
		return this._getProperty('align-content');
	}
	public set alignContent(alignContent: string) {
		this.setProperty('align-content', alignContent);
	}

	public get alignItems(): string {
		return this._getProperty('align-items');
	}
	public set alignItems(alignItems: string) {
		this.setProperty('align-items', alignItems);
	}

	public get alignSelf(): string {
		return this._getProperty('align-self');
	}
	public set alignSelf(alignSelf: string) {
		this.setProperty('align-self', alignSelf);
	}

	public get alignmentBaseline(): string {
		return this._getProperty('alignment-baseline');
	}
	public set alignmentBaseline(alignmentBaseline: string) {
		this.setProperty('alignment-baseline', alignmentBaseline);
	}

	public get all(): string {
		return this._getProperty('all');
	}
	public set all(all: string) {
		this.setProperty('all', all);
	}

	public get animation(): string {
		return this._getProperty('animation');
	}
	public set animation(animation: string) {
		this.setProperty('animation', animation);
	}

	public get animationDelay(): string {
		return this._getProperty('animation-delay');
	}
	public set animationDelay(animationDelay: string) {
		this.setProperty('animation-delay', animationDelay);
	}

	public get animationDirection(): string {
		return this._getProperty('animation-direction');
	}
	public set animationDirection(animationDirection: string) {
		this.setProperty('animation-direction', animationDirection);
	}

	public get animationDuration(): string {
		return this._getProperty('animation-duration');
	}
	public set animationDuration(animationDuration: string) {
		this.setProperty('animation-duration', animationDuration);
	}

	public get animationFillMode(): string {
		return this._getProperty('animation-fill-mode');
	}
	public set animationFillMode(animationFillMode: string) {
		this.setProperty('animation-fill-mode', animationFillMode);
	}

	public get animationIterationCount(): string {
		return this._getProperty('animation-iteration-count');
	}
	public set animationIterationCount(animationIterationCount: string) {
		this.setProperty('animation-iteration-count', animationIterationCount);
	}

	public get animationName(): string {
		return this._getProperty('animation-name');
	}
	public set animationName(animationName: string) {
		this.setProperty('animation-name', animationName);
	}

	public get animationPlayState(): string {
		return this._getProperty('animation-play-state');
	}
	public set animationPlayState(animationPlayState: string) {
		this.setProperty('animation-play-state', animationPlayState);
	}

	public get animationTimingFunction(): string {
		return this._getProperty('animation-timing-function');
	}
	public set animationTimingFunction(animationTimingFunction: string) {
		this.setProperty('animation-timing-function', animationTimingFunction);
	}

	public get appearance(): string {
		return this._getProperty('appearance');
	}
	public set appearance(appearance: string) {
		this.setProperty('appearance', appearance);
	}

	public get backdropFilter(): string {
		return this._getProperty('backdrop-filter');
	}
	public set backdropFilter(backdropFilter: string) {
		this.setProperty('backdrop-filter', backdropFilter);
	}

	public get backfaceVisibility(): string {
		return this._getProperty('backface-visibility');
	}
	public set backfaceVisibility(backfaceVisibility: string) {
		this.setProperty('backface-visibility', backfaceVisibility);
	}

	public get background(): string {
		return this._getProperty('background');
	}
	public set background(background: string) {
		this.setProperty('background', background);
	}

	public get backgroundAttachment(): string {
		return this._getProperty('background-attachment');
	}
	public set backgroundAttachment(backgroundAttachment: string) {
		this.setProperty('background-attachment', backgroundAttachment);
	}

	public get backgroundBlendMode(): string {
		return this._getProperty('background-blend-mode');
	}
	public set backgroundBlendMode(backgroundBlendMode: string) {
		this.setProperty('background-blend-mode', backgroundBlendMode);
	}

	public get backgroundClip(): string {
		return this._getProperty('background-clip');
	}
	public set backgroundClip(backgroundClip: string) {
		this.setProperty('background-clip', backgroundClip);
	}

	public get backgroundColor(): string {
		return this._getProperty('background-color');
	}
	public set backgroundColor(backgroundColor: string) {
		this.setProperty('background-color', backgroundColor);
	}

	public get backgroundImage(): string {
		return this._getProperty('background-image');
	}
	public set backgroundImage(backgroundImage: string) {
		this.setProperty('background-image', backgroundImage);
	}

	public get backgroundOrigin(): string {
		return this._getProperty('background-origin');
	}
	public set backgroundOrigin(backgroundOrigin: string) {
		this.setProperty('background-origin', backgroundOrigin);
	}

	public get backgroundPosition(): string {
		return this._getProperty('background-position');
	}
	public set backgroundPosition(backgroundPosition: string) {
		this.setProperty('background-position', backgroundPosition);
	}

	public get backgroundPositionX(): string {
		return this._getProperty('background-position-x');
	}
	public set backgroundPositionX(backgroundPositionX: string) {
		this.setProperty('background-position-x', backgroundPositionX);
	}

	public get backgroundPositionY(): string {
		return this._getProperty('background-position-y');
	}
	public set backgroundPositionY(backgroundPositionY: string) {
		this.setProperty('background-position-y', backgroundPositionY);
	}

	public get backgroundRepeat(): string {
		return this._getProperty('background-repeat');
	}
	public set backgroundRepeat(backgroundRepeat: string) {
		this.setProperty('background-repeat', backgroundRepeat);
	}

	public get backgroundRepeatX(): string {
		return this._getProperty('background-repeat-x');
	}
	public set backgroundRepeatX(backgroundRepeatX: string) {
		this.setProperty('background-repeat-x', backgroundRepeatX);
	}

	public get backgroundRepeatY(): string {
		return this._getProperty('background-repeat-y');
	}
	public set backgroundRepeatY(backgroundRepeatY: string) {
		this.setProperty('background-repeat-y', backgroundRepeatY);
	}

	public get backgroundSize(): string {
		return this._getProperty('background-size');
	}
	public set backgroundSize(backgroundSize: string) {
		this.setProperty('background-size', backgroundSize);
	}

	public get baselineShift(): string {
		return this._getProperty('baseline-shift');
	}
	public set baselineShift(baselineShift: string) {
		this.setProperty('baseline-shift', baselineShift);
	}

	public get blockSize(): string {
		return this._getProperty('block-size');
	}
	public set blockSize(blockSize: string) {
		this.setProperty('block-size', blockSize);
	}

	public get border(): string {
		return this._getProperty('border');
	}
	public set border(border: string) {
		this.setProperty('border', border);
	}

	public get borderBlockEnd(): string {
		return this._getProperty('border-block-end');
	}
	public set borderBlockEnd(borderBlockEnd: string) {
		this.setProperty('border-block-end', borderBlockEnd);
	}

	public get borderBlockEndColor(): string {
		return this._getProperty('border-block-end-color');
	}
	public set borderBlockEndColor(borderBlockEndColor: string) {
		this.setProperty('border-block-end-color', borderBlockEndColor);
	}

	public get borderBlockEndStyle(): string {
		return this._getProperty('border-block-end-style');
	}
	public set borderBlockEndStyle(borderBlockEndStyle: string) {
		this.setProperty('border-block-end-style', borderBlockEndStyle);
	}

	public get borderBlockEndWidth(): string {
		return this._getProperty('border-block-end-width');
	}
	public set borderBlockEndWidth(borderBlockEndWidth: string) {
		this.setProperty('border-block-end-width', borderBlockEndWidth);
	}

	public get borderBlockStart(): string {
		return this._getProperty('border-block-start');
	}
	public set borderBlockStart(borderBlockStart: string) {
		this.setProperty('border-block-start', borderBlockStart);
	}

	public get borderBlockStartColor(): string {
		return this._getProperty('border-block-start-color');
	}
	public set borderBlockStartColor(borderBlockStartColor: string) {
		this.setProperty('border-block-start-color', borderBlockStartColor);
	}

	public get borderBlockStartStyle(): string {
		return this._getProperty('border-block-start-style');
	}
	public set borderBlockStartStyle(borderBlockStartStyle: string) {
		this.setProperty('border-block-start-style', borderBlockStartStyle);
	}

	public get borderBlockStartWidth(): string {
		return this._getProperty('border-block-start-width');
	}
	public set borderBlockStartWidth(borderBlockStartWidth: string) {
		this.setProperty('border-block-start-width', borderBlockStartWidth);
	}

	public get borderBottom(): string {
		return this._getProperty('border-bottom');
	}
	public set borderBottom(borderBottom: string) {
		this.setProperty('border-bottom', borderBottom);
	}

	public get borderBottomColor(): string {
		return this._getProperty('border-bottom-color');
	}
	public set borderBottomColor(borderBottomColor: string) {
		this.setProperty('border-bottom-color', borderBottomColor);
	}

	public get borderBottomLeftRadius(): string {
		return this._getProperty('border-bottom-left-radius');
	}
	public set borderBottomLeftRadius(borderBottomLeftRadius: string) {
		this.setProperty('border-bottom-left-radius', borderBottomLeftRadius);
	}

	public get borderBottomRightRadius(): string {
		return this._getProperty('border-bottom-right-radius');
	}
	public set borderBottomRightRadius(borderBottomRightRadius: string) {
		this.setProperty('border-bottom-right-radius', borderBottomRightRadius);
	}

	public get borderBottomStyle(): string {
		return this._getProperty('border-bottom-style');
	}
	public set borderBottomStyle(borderBottomStyle: string) {
		this.setProperty('border-bottom-style', borderBottomStyle);
	}

	public get borderBottomWidth(): string {
		return this._getProperty('border-bottom-width');
	}
	public set borderBottomWidth(borderBottomWidth: string) {
		this.setProperty('border-bottom-width', borderBottomWidth);
	}

	public get borderCollapse(): string {
		return this._getProperty('border-collapse');
	}
	public set borderCollapse(borderCollapse: string) {
		this.setProperty('border-collapse', borderCollapse);
	}

	public get borderColor(): string {
		return this._getProperty('border-color');
	}
	public set borderColor(borderColor: string) {
		this.setProperty('border-color', borderColor);
	}

	public get borderImage(): string {
		return this._getProperty('border-image');
	}
	public set borderImage(borderImage: string) {
		this.setProperty('border-image', borderImage);
	}

	public get borderImageOutset(): string {
		return this._getProperty('border-image-outset');
	}
	public set borderImageOutset(borderImageOutset: string) {
		this.setProperty('border-image-outset', borderImageOutset);
	}

	public get borderImageRepeat(): string {
		return this._getProperty('border-image-repeat');
	}
	public set borderImageRepeat(borderImageRepeat: string) {
		this.setProperty('border-image-repeat', borderImageRepeat);
	}

	public get borderImageSlice(): string {
		return this._getProperty('border-image-slice');
	}
	public set borderImageSlice(borderImageSlice: string) {
		this.setProperty('border-image-slice', borderImageSlice);
	}

	public get borderImageSource(): string {
		return this._getProperty('border-image-source');
	}
	public set borderImageSource(borderImageSource: string) {
		this.setProperty('border-image-source', borderImageSource);
	}

	public get borderImageWidth(): string {
		return this._getProperty('border-image-width');
	}
	public set borderImageWidth(borderImageWidth: string) {
		this.setProperty('border-image-width', borderImageWidth);
	}

	public get borderInlineEnd(): string {
		return this._getProperty('border-inline-end');
	}
	public set borderInlineEnd(borderInlineEnd: string) {
		this.setProperty('border-inline-end', borderInlineEnd);
	}

	public get borderInlineEndColor(): string {
		return this._getProperty('border-inline-end-color');
	}
	public set borderInlineEndColor(borderInlineEndColor: string) {
		this.setProperty('border-inline-end-color', borderInlineEndColor);
	}

	public get borderInlineEndStyle(): string {
		return this._getProperty('border-inline-end-style');
	}
	public set borderInlineEndStyle(borderInlineEndStyle: string) {
		this.setProperty('border-inline-end-style', borderInlineEndStyle);
	}

	public get borderInlineEndWidth(): string {
		return this._getProperty('border-inline-end-width');
	}
	public set borderInlineEndWidth(borderInlineEndWidth: string) {
		this.setProperty('border-inline-end-width', borderInlineEndWidth);
	}

	public get borderInlineStart(): string {
		return this._getProperty('border-inline-start');
	}
	public set borderInlineStart(borderInlineStart: string) {
		this.setProperty('border-inline-start', borderInlineStart);
	}

	public get borderInlineStartColor(): string {
		return this._getProperty('border-inline-start-color');
	}
	public set borderInlineStartColor(borderInlineStartColor: string) {
		this.setProperty('border-inline-start-color', borderInlineStartColor);
	}

	public get borderInlineStartStyle(): string {
		return this._getProperty('border-inline-start-style');
	}
	public set borderInlineStartStyle(borderInlineStartStyle: string) {
		this.setProperty('border-inline-start-style', borderInlineStartStyle);
	}

	public get borderInlineStartWidth(): string {
		return this._getProperty('border-inline-start-width');
	}
	public set borderInlineStartWidth(borderInlineStartWidth: string) {
		this.setProperty('border-inline-start-width', borderInlineStartWidth);
	}

	public get borderLeft(): string {
		return this._getProperty('border-left');
	}
	public set borderLeft(borderLeft: string) {
		this.setProperty('border-left', borderLeft);
	}

	public get borderLeftColor(): string {
		return this._getProperty('border-left-color');
	}
	public set borderLeftColor(borderLeftColor: string) {
		this.setProperty('border-left-color', borderLeftColor);
	}

	public get borderLeftStyle(): string {
		return this._getProperty('border-left-style');
	}
	public set borderLeftStyle(borderLeftStyle: string) {
		this.setProperty('border-left-style', borderLeftStyle);
	}

	public get borderLeftWidth(): string {
		return this._getProperty('border-left-width');
	}
	public set borderLeftWidth(borderLeftWidth: string) {
		this.setProperty('border-left-width', borderLeftWidth);
	}

	public get borderRadius(): string {
		return this._getProperty('border-radius');
	}
	public set borderRadius(borderRadius: string) {
		this.setProperty('border-radius', borderRadius);
	}

	public get borderRight(): string {
		return this._getProperty('border-right');
	}
	public set borderRight(borderRight: string) {
		this.setProperty('border-right', borderRight);
	}

	public get borderRightColor(): string {
		return this._getProperty('border-right-color');
	}
	public set borderRightColor(borderRightColor: string) {
		this.setProperty('border-right-color', borderRightColor);
	}

	public get borderRightStyle(): string {
		return this._getProperty('border-right-style');
	}
	public set borderRightStyle(borderRightStyle: string) {
		this.setProperty('border-right-style', borderRightStyle);
	}

	public get borderRightWidth(): string {
		return this._getProperty('border-right-width');
	}
	public set borderRightWidth(borderRightWidth: string) {
		this.setProperty('border-right-width', borderRightWidth);
	}

	public get borderSpacing(): string {
		return this._getProperty('border-spacing');
	}
	public set borderSpacing(borderSpacing: string) {
		this.setProperty('border-spacing', borderSpacing);
	}

	public get borderStyle(): string {
		return this._getProperty('border-style');
	}
	public set borderStyle(borderStyle: string) {
		this.setProperty('border-style', borderStyle);
	}

	public get borderTop(): string {
		return this._getProperty('border-top');
	}
	public set borderTop(borderTop: string) {
		this.setProperty('border-top', borderTop);
	}

	public get borderTopColor(): string {
		return this._getProperty('border-top-color');
	}
	public set borderTopColor(borderTopColor: string) {
		this.setProperty('border-top-color', borderTopColor);
	}

	public get borderTopLeftRadius(): string {
		return this._getProperty('border-top-left-radius');
	}
	public set borderTopLeftRadius(borderTopLeftRadius: string) {
		this.setProperty('border-top-left-radius', borderTopLeftRadius);
	}

	public get borderTopRightRadius(): string {
		return this._getProperty('border-top-right-radius');
	}
	public set borderTopRightRadius(borderTopRightRadius: string) {
		this.setProperty('border-top-right-radius', borderTopRightRadius);
	}

	public get borderTopStyle(): string {
		return this._getProperty('border-top-style');
	}
	public set borderTopStyle(borderTopStyle: string) {
		this.setProperty('border-top-style', borderTopStyle);
	}

	public get borderTopWidth(): string {
		return this._getProperty('border-top-width');
	}
	public set borderTopWidth(borderTopWidth: string) {
		this.setProperty('border-top-width', borderTopWidth);
	}

	public get borderWidth(): string {
		return this._getProperty('border-width');
	}
	public set borderWidth(borderWidth: string) {
		this.setProperty('border-width', borderWidth);
	}

	public get bottom(): string {
		return this._getProperty('bottom');
	}
	public set bottom(bottom: string) {
		this.setProperty('bottom', bottom);
	}

	public get boxShadow(): string {
		return this._getProperty('box-shadow');
	}
	public set boxShadow(boxShadow: string) {
		this.setProperty('box-shadow', boxShadow);
	}

	public get boxSizing(): string {
		return this._getProperty('box-sizing');
	}
	public set boxSizing(boxSizing: string) {
		this.setProperty('box-sizing', boxSizing);
	}

	public get breakAfter(): string {
		return this._getProperty('break-after');
	}
	public set breakAfter(breakAfter: string) {
		this.setProperty('break-after', breakAfter);
	}

	public get breakBefore(): string {
		return this._getProperty('break-before');
	}
	public set breakBefore(breakBefore: string) {
		this.setProperty('break-before', breakBefore);
	}

	public get breakInside(): string {
		return this._getProperty('break-inside');
	}
	public set breakInside(breakInside: string) {
		this.setProperty('break-inside', breakInside);
	}

	public get bufferedRendering(): string {
		return this._getProperty('buffered-rendering');
	}
	public set bufferedRendering(bufferedRendering: string) {
		this.setProperty('buffered-rendering', bufferedRendering);
	}

	public get captionSide(): string {
		return this._getProperty('caption-side');
	}
	public set captionSide(captionSide: string) {
		this.setProperty('caption-side', captionSide);
	}

	public get caretColor(): string {
		return this._getProperty('caret-color');
	}
	public set caretColor(caretColor: string) {
		this.setProperty('caret-color', caretColor);
	}

	public get clear(): string {
		return this._getProperty('clear');
	}
	public set clear(clear: string) {
		this.setProperty('clear', clear);
	}

	public get clip(): string {
		return this._getProperty('clip');
	}
	public set clip(clip: string) {
		this.setProperty('clip', clip);
	}

	public get clipPath(): string {
		return this._getProperty('clip-path');
	}
	public set clipPath(clipPath: string) {
		this.setProperty('clip-path', clipPath);
	}

	public get clipRule(): string {
		return this._getProperty('clip-rule');
	}
	public set clipRule(clipRule: string) {
		this.setProperty('clip-rule', clipRule);
	}

	public get color(): string {
		return this._getProperty('color');
	}
	public set color(color: string) {
		this.setProperty('color', color);
	}

	public get colorInterpolation(): string {
		return this._getProperty('color-interpolation');
	}
	public set colorInterpolation(colorInterpolation: string) {
		this.setProperty('color-interpolation', colorInterpolation);
	}

	public get colorInterpolationFilters(): string {
		return this._getProperty('color-interpolation-filters');
	}
	public set colorInterpolationFilters(colorInterpolationFilters: string) {
		this.setProperty('color-interpolation-filters', colorInterpolationFilters);
	}

	public get colorRendering(): string {
		return this._getProperty('color-rendering');
	}
	public set colorRendering(colorRendering: string) {
		this.setProperty('color-rendering', colorRendering);
	}

	public get colorScheme(): string {
		return this._getProperty('color-scheme');
	}
	public set colorScheme(colorScheme: string) {
		this.setProperty('color-scheme', colorScheme);
	}

	public get columnCount(): string {
		return this._getProperty('column-count');
	}
	public set columnCount(columnCount: string) {
		this.setProperty('column-count', columnCount);
	}

	public get columnFill(): string {
		return this._getProperty('column-fill');
	}
	public set columnFill(columnFill: string) {
		this.setProperty('column-fill', columnFill);
	}

	public get columnGap(): string {
		return this._getProperty('column-gap');
	}
	public set columnGap(columnGap: string) {
		this.setProperty('column-gap', columnGap);
	}

	public get columnRule(): string {
		return this._getProperty('column-rule');
	}
	public set columnRule(columnRule: string) {
		this.setProperty('column-rule', columnRule);
	}

	public get columnRuleColor(): string {
		return this._getProperty('column-rule-color');
	}
	public set columnRuleColor(columnRuleColor: string) {
		this.setProperty('column-rule-color', columnRuleColor);
	}

	public get columnRuleStyle(): string {
		return this._getProperty('column-rule-style');
	}
	public set columnRuleStyle(columnRuleStyle: string) {
		this.setProperty('column-rule-style', columnRuleStyle);
	}

	public get columnRuleWidth(): string {
		return this._getProperty('column-rule-width');
	}
	public set columnRuleWidth(columnRuleWidth: string) {
		this.setProperty('column-rule-width', columnRuleWidth);
	}

	public get columnSpan(): string {
		return this._getProperty('column-span');
	}
	public set columnSpan(columnSpan: string) {
		this.setProperty('column-span', columnSpan);
	}

	public get columnWidth(): string {
		return this._getProperty('column-width');
	}
	public set columnWidth(columnWidth: string) {
		this.setProperty('column-width', columnWidth);
	}

	public get columns(): string {
		return this._getProperty('columns');
	}
	public set columns(columns: string) {
		this.setProperty('columns', columns);
	}

	public get contain(): string {
		return this._getProperty('contain');
	}
	public set contain(contain: string) {
		this.setProperty('contain', contain);
	}

	public get containIntrinsicSize(): string {
		return this._getProperty('contain-intrinsic-size');
	}
	public set containIntrinsicSize(containIntrinsicSize: string) {
		this.setProperty('contain-intrinsic-size', containIntrinsicSize);
	}

	public get content(): string {
		return this._getProperty('content');
	}
	public set content(content: string) {
		this.setProperty('content', content);
	}

	public get contentVisibility(): string {
		return this._getProperty('content-visibility');
	}
	public set contentVisibility(contentVisibility: string) {
		this.setProperty('content-visibility', contentVisibility);
	}

	public get counterIncrement(): string {
		return this._getProperty('counter-increment');
	}
	public set counterIncrement(counterIncrement: string) {
		this.setProperty('counter-increment', counterIncrement);
	}

	public get counterReset(): string {
		return this._getProperty('counter-reset');
	}
	public set counterReset(counterReset: string) {
		this.setProperty('counter-reset', counterReset);
	}

	public get counterSet(): string {
		return this._getProperty('counter-set');
	}
	public set counterSet(counterSet: string) {
		this.setProperty('counter-set', counterSet);
	}

	public get cssFloat(): string {
		return this._getProperty('css-float');
	}
	public set cssFloat(cssFloat: string) {
		this.setProperty('css-float', cssFloat);
	}

	public get cursor(): string {
		return this._getProperty('cursor');
	}
	public set cursor(cursor: string) {
		this.setProperty('cursor', cursor);
	}

	public get cx(): string {
		return this._getProperty('cx');
	}
	public set cx(cx: string) {
		this.setProperty('cx', cx);
	}

	public get cy(): string {
		return this._getProperty('cy');
	}
	public set cy(cy: string) {
		this.setProperty('cy', cy);
	}

	public get d(): string {
		return this._getProperty('d');
	}
	public set d(d: string) {
		this.setProperty('d', d);
	}

	public get direction(): string {
		return this._getProperty('direction');
	}
	public set direction(direction: string) {
		this.setProperty('direction', direction);
	}

	public get display(): string {
		return this._getProperty('display');
	}
	public set display(display: string) {
		this.setProperty('display', display);
	}

	public get dominantBaseline(): string {
		return this._getProperty('dominant-baseline');
	}
	public set dominantBaseline(dominantBaseline: string) {
		this.setProperty('dominant-baseline', dominantBaseline);
	}

	public get emptyCells(): string {
		return this._getProperty('empty-cells');
	}
	public set emptyCells(emptyCells: string) {
		this.setProperty('empty-cells', emptyCells);
	}

	public get fill(): string {
		return this._getProperty('fill');
	}
	public set fill(fill: string) {
		this.setProperty('fill', fill);
	}

	public get fillOpacity(): string {
		return this._getProperty('fill-opacity');
	}
	public set fillOpacity(fillOpacity: string) {
		this.setProperty('fill-opacity', fillOpacity);
	}

	public get fillRule(): string {
		return this._getProperty('fill-rule');
	}
	public set fillRule(fillRule: string) {
		this.setProperty('fill-rule', fillRule);
	}

	public get filter(): string {
		return this._getProperty('filter');
	}
	public set filter(filter: string) {
		this.setProperty('filter', filter);
	}

	public get flex(): string {
		return this._getProperty('flex');
	}
	public set flex(flex: string) {
		this.setProperty('flex', flex);
	}

	public get flexBasis(): string {
		return this._getProperty('flex-basis');
	}
	public set flexBasis(flexBasis: string) {
		this.setProperty('flex-basis', flexBasis);
	}

	public get flexDirection(): string {
		return this._getProperty('flex-direction');
	}
	public set flexDirection(flexDirection: string) {
		this.setProperty('flex-direction', flexDirection);
	}

	public get flexFlow(): string {
		return this._getProperty('flex-flow');
	}
	public set flexFlow(flexFlow: string) {
		this.setProperty('flex-flow', flexFlow);
	}

	public get flexGrow(): string {
		return this._getProperty('flex-grow');
	}
	public set flexGrow(flexGrow: string) {
		this.setProperty('flex-grow', flexGrow);
	}

	public get flexShrink(): string {
		return this._getProperty('flex-shrink');
	}
	public set flexShrink(flexShrink: string) {
		this.setProperty('flex-shrink', flexShrink);
	}

	public get flexWrap(): string {
		return this._getProperty('flex-wrap');
	}
	public set flexWrap(flexWrap: string) {
		this.setProperty('flex-wrap', flexWrap);
	}

	public get float(): string {
		return this._getProperty('float');
	}
	public set float(float: string) {
		this.setProperty('float', float);
	}

	public get floodColor(): string {
		return this._getProperty('flood-color');
	}
	public set floodColor(floodColor: string) {
		this.setProperty('flood-color', floodColor);
	}

	public get floodOpacity(): string {
		return this._getProperty('flood-opacity');
	}
	public set floodOpacity(floodOpacity: string) {
		this.setProperty('flood-opacity', floodOpacity);
	}

	public get font(): string {
		return this._getProperty('font');
	}
	public set font(font: string) {
		this.setProperty('font', font);
	}

	public get fontDisplay(): string {
		return this._getProperty('font-display');
	}
	public set fontDisplay(fontDisplay: string) {
		this.setProperty('font-display', fontDisplay);
	}

	public get fontFamily(): string {
		return this._getProperty('font-family');
	}
	public set fontFamily(fontFamily: string) {
		this.setProperty('font-family', fontFamily);
	}

	public get fontFeatureSettings(): string {
		return this._getProperty('font-feature-settings');
	}
	public set fontFeatureSettings(fontFeatureSettings: string) {
		this.setProperty('font-feature-settings', fontFeatureSettings);
	}

	public get fontKerning(): string {
		return this._getProperty('font-kerning');
	}
	public set fontKerning(fontKerning: string) {
		this.setProperty('font-kerning', fontKerning);
	}

	public get fontOpticalSizing(): string {
		return this._getProperty('font-optical-sizing');
	}
	public set fontOpticalSizing(fontOpticalSizing: string) {
		this.setProperty('font-optical-sizing', fontOpticalSizing);
	}

	public get fontSize(): string {
		return this._getProperty('font-size');
	}
	public set fontSize(fontSize: string) {
		this.setProperty('font-size', fontSize);
	}

	public get fontStretch(): string {
		return this._getProperty('font-stretch');
	}
	public set fontStretch(fontStretch: string) {
		this.setProperty('font-stretch', fontStretch);
	}

	public get fontStyle(): string {
		return this._getProperty('font-style');
	}
	public set fontStyle(fontStyle: string) {
		this.setProperty('font-style', fontStyle);
	}

	public get fontVariant(): string {
		return this._getProperty('font-variant');
	}
	public set fontVariant(fontVariant: string) {
		this.setProperty('font-variant', fontVariant);
	}

	public get fontVariantCaps(): string {
		return this._getProperty('font-variant-caps');
	}
	public set fontVariantCaps(fontVariantCaps: string) {
		this.setProperty('font-variant-caps', fontVariantCaps);
	}

	public get fontVariantEastAsian(): string {
		return this._getProperty('font-variant-east-asian');
	}
	public set fontVariantEastAsian(fontVariantEastAsian: string) {
		this.setProperty('font-variant-east-asian', fontVariantEastAsian);
	}

	public get fontVariantLigatures(): string {
		return this._getProperty('font-variant-ligatures');
	}
	public set fontVariantLigatures(fontVariantLigatures: string) {
		this.setProperty('font-variant-ligatures', fontVariantLigatures);
	}

	public get fontVariantNumeric(): string {
		return this._getProperty('font-variant-numeric');
	}
	public set fontVariantNumeric(fontVariantNumeric: string) {
		this.setProperty('font-variant-numeric', fontVariantNumeric);
	}

	public get fontVariationSettings(): string {
		return this._getProperty('font-variation-settings');
	}
	public set fontVariationSettings(fontVariationSettings: string) {
		this.setProperty('font-variation-settings', fontVariationSettings);
	}

	public get fontWeight(): string {
		return this._getProperty('font-weight');
	}
	public set fontWeight(fontWeight: string) {
		this.setProperty('font-weight', fontWeight);
	}

	public get gap(): string {
		return this._getProperty('gap');
	}
	public set gap(gap: string) {
		this.setProperty('gap', gap);
	}

	public get grid(): string {
		return this._getProperty('grid');
	}
	public set grid(grid: string) {
		this.setProperty('grid', grid);
	}

	public get gridArea(): string {
		return this._getProperty('grid-area');
	}
	public set gridArea(gridArea: string) {
		this.setProperty('grid-area', gridArea);
	}

	public get gridAutoColumns(): string {
		return this._getProperty('grid-auto-columns');
	}
	public set gridAutoColumns(gridAutoColumns: string) {
		this.setProperty('grid-auto-columns', gridAutoColumns);
	}

	public get gridAutoFlow(): string {
		return this._getProperty('grid-auto-flow');
	}
	public set gridAutoFlow(gridAutoFlow: string) {
		this.setProperty('grid-auto-flow', gridAutoFlow);
	}

	public get gridAutoRows(): string {
		return this._getProperty('grid-auto-rows');
	}
	public set gridAutoRows(gridAutoRows: string) {
		this.setProperty('grid-auto-rows', gridAutoRows);
	}

	public get gridColumn(): string {
		return this._getProperty('grid-column');
	}
	public set gridColumn(gridColumn: string) {
		this.setProperty('grid-column', gridColumn);
	}

	public get gridColumnEnd(): string {
		return this._getProperty('grid-column-end');
	}
	public set gridColumnEnd(gridColumnEnd: string) {
		this.setProperty('grid-column-end', gridColumnEnd);
	}

	public get gridColumnGap(): string {
		return this._getProperty('grid-column-gap');
	}
	public set gridColumnGap(gridColumnGap: string) {
		this.setProperty('grid-column-gap', gridColumnGap);
	}

	public get gridColumnStart(): string {
		return this._getProperty('grid-column-start');
	}
	public set gridColumnStart(gridColumnStart: string) {
		this.setProperty('grid-column-start', gridColumnStart);
	}

	public get gridGap(): string {
		return this._getProperty('grid-gap');
	}
	public set gridGap(gridGap: string) {
		this.setProperty('grid-gap', gridGap);
	}

	public get gridRow(): string {
		return this._getProperty('grid-row');
	}
	public set gridRow(gridRow: string) {
		this.setProperty('grid-row', gridRow);
	}

	public get gridRowEnd(): string {
		return this._getProperty('grid-row-end');
	}
	public set gridRowEnd(gridRowEnd: string) {
		this.setProperty('grid-row-end', gridRowEnd);
	}

	public get gridRowGap(): string {
		return this._getProperty('grid-row-gap');
	}
	public set gridRowGap(gridRowGap: string) {
		this.setProperty('grid-row-gap', gridRowGap);
	}

	public get gridRowStart(): string {
		return this._getProperty('grid-row-start');
	}
	public set gridRowStart(gridRowStart: string) {
		this.setProperty('grid-row-start', gridRowStart);
	}

	public get gridTemplate(): string {
		return this._getProperty('grid-template');
	}
	public set gridTemplate(gridTemplate: string) {
		this.setProperty('grid-template', gridTemplate);
	}

	public get gridTemplateAreas(): string {
		return this._getProperty('grid-template-areas');
	}
	public set gridTemplateAreas(gridTemplateAreas: string) {
		this.setProperty('grid-template-areas', gridTemplateAreas);
	}

	public get gridTemplateColumns(): string {
		return this._getProperty('grid-template-columns');
	}
	public set gridTemplateColumns(gridTemplateColumns: string) {
		this.setProperty('grid-template-columns', gridTemplateColumns);
	}

	public get gridTemplateRows(): string {
		return this._getProperty('grid-template-rows');
	}
	public set gridTemplateRows(gridTemplateRows: string) {
		this.setProperty('grid-template-rows', gridTemplateRows);
	}

	public get height(): string {
		return this._getProperty('height');
	}
	public set height(height: string) {
		this.setProperty('height', height);
	}

	public get hyphens(): string {
		return this._getProperty('hyphens');
	}
	public set hyphens(hyphens: string) {
		this.setProperty('hyphens', hyphens);
	}

	public get imageOrientation(): string {
		return this._getProperty('image-orientation');
	}
	public set imageOrientation(imageOrientation: string) {
		this.setProperty('image-orientation', imageOrientation);
	}

	public get imageRendering(): string {
		return this._getProperty('image-rendering');
	}
	public set imageRendering(imageRendering: string) {
		this.setProperty('image-rendering', imageRendering);
	}

	public get inherits(): string {
		return this._getProperty('inherits');
	}
	public set inherits(inherits: string) {
		this.setProperty('inherits', inherits);
	}

	public get initialValue(): string {
		return this._getProperty('initial-value');
	}
	public set initialValue(initialValue: string) {
		this.setProperty('initial-value', initialValue);
	}

	public get inlineSize(): string {
		return this._getProperty('inline-size');
	}
	public set inlineSize(inlineSize: string) {
		this.setProperty('inline-size', inlineSize);
	}

	public get isolation(): string {
		return this._getProperty('isolation');
	}
	public set isolation(isolation: string) {
		this.setProperty('isolation', isolation);
	}

	public get justifyContent(): string {
		return this._getProperty('justify-content');
	}
	public set justifyContent(justifyContent: string) {
		this.setProperty('justify-content', justifyContent);
	}

	public get justifyItems(): string {
		return this._getProperty('justify-items');
	}
	public set justifyItems(justifyItems: string) {
		this.setProperty('justify-items', justifyItems);
	}

	public get justifySelf(): string {
		return this._getProperty('justify-self');
	}
	public set justifySelf(justifySelf: string) {
		this.setProperty('justify-self', justifySelf);
	}

	public get left(): string {
		return this._getProperty('left');
	}
	public set left(left: string) {
		this.setProperty('left', left);
	}

	public get letterSpacing(): string {
		return this._getProperty('letter-spacing');
	}
	public set letterSpacing(letterSpacing: string) {
		this.setProperty('letter-spacing', letterSpacing);
	}

	public get lightingColor(): string {
		return this._getProperty('lighting-color');
	}
	public set lightingColor(lightingColor: string) {
		this.setProperty('lighting-color', lightingColor);
	}

	public get lineBreak(): string {
		return this._getProperty('line-break');
	}
	public set lineBreak(lineBreak: string) {
		this.setProperty('line-break', lineBreak);
	}

	public get lineHeight(): string {
		return this._getProperty('line-height');
	}
	public set lineHeight(lineHeight: string) {
		this.setProperty('line-height', lineHeight);
	}

	public get listStyle(): string {
		return this._getProperty('list-style');
	}
	public set listStyle(listStyle: string) {
		this.setProperty('list-style', listStyle);
	}

	public get listStyleImage(): string {
		return this._getProperty('list-style-image');
	}
	public set listStyleImage(listStyleImage: string) {
		this.setProperty('list-style-image', listStyleImage);
	}

	public get listStylePosition(): string {
		return this._getProperty('list-style-position');
	}
	public set listStylePosition(listStylePosition: string) {
		this.setProperty('list-style-position', listStylePosition);
	}

	public get listStyleType(): string {
		return this._getProperty('list-style-type');
	}
	public set listStyleType(listStyleType: string) {
		this.setProperty('list-style-type', listStyleType);
	}

	public get margin(): string {
		return this._getProperty('margin');
	}
	public set margin(margin: string) {
		this.setProperty('margin', margin);
	}

	public get marginBlockEnd(): string {
		return this._getProperty('margin-block-end');
	}
	public set marginBlockEnd(marginBlockEnd: string) {
		this.setProperty('margin-block-end', marginBlockEnd);
	}

	public get marginBlockStart(): string {
		return this._getProperty('margin-block-start');
	}
	public set marginBlockStart(marginBlockStart: string) {
		this.setProperty('margin-block-start', marginBlockStart);
	}

	public get marginBottom(): string {
		return this._getProperty('margin-bottom');
	}
	public set marginBottom(marginBottom: string) {
		this.setProperty('margin-bottom', marginBottom);
	}

	public get marginInlineEnd(): string {
		return this._getProperty('margin-inline-end');
	}
	public set marginInlineEnd(marginInlineEnd: string) {
		this.setProperty('margin-inline-end', marginInlineEnd);
	}

	public get marginInlineStart(): string {
		return this._getProperty('margin-inline-start');
	}
	public set marginInlineStart(marginInlineStart: string) {
		this.setProperty('margin-inline-start', marginInlineStart);
	}

	public get marginLeft(): string {
		return this._getProperty('margin-left');
	}
	public set marginLeft(marginLeft: string) {
		this.setProperty('margin-left', marginLeft);
	}

	public get marginRight(): string {
		return this._getProperty('margin-right');
	}
	public set marginRight(marginRight: string) {
		this.setProperty('margin-right', marginRight);
	}

	public get marginTop(): string {
		return this._getProperty('margin-top');
	}
	public set marginTop(marginTop: string) {
		this.setProperty('margin-top', marginTop);
	}

	public get marker(): string {
		return this._getProperty('marker');
	}
	public set marker(marker: string) {
		this.setProperty('marker', marker);
	}

	public get markerEnd(): string {
		return this._getProperty('marker-end');
	}
	public set markerEnd(markerEnd: string) {
		this.setProperty('marker-end', markerEnd);
	}

	public get markerMid(): string {
		return this._getProperty('marker-mid');
	}
	public set markerMid(markerMid: string) {
		this.setProperty('marker-mid', markerMid);
	}

	public get markerStart(): string {
		return this._getProperty('marker-start');
	}
	public set markerStart(markerStart: string) {
		this.setProperty('marker-start', markerStart);
	}

	public get mask(): string {
		return this._getProperty('mask');
	}
	public set mask(mask: string) {
		this.setProperty('mask', mask);
	}

	public get maskType(): string {
		return this._getProperty('mask-type');
	}
	public set maskType(maskType: string) {
		this.setProperty('mask-type', maskType);
	}

	public get maxBlockSize(): string {
		return this._getProperty('max-block-size');
	}
	public set maxBlockSize(maxBlockSize: string) {
		this.setProperty('max-block-size', maxBlockSize);
	}

	public get maxHeight(): string {
		return this._getProperty('max-height');
	}
	public set maxHeight(maxHeight: string) {
		this.setProperty('max-height', maxHeight);
	}

	public get maxInlineSize(): string {
		return this._getProperty('max-inline-size');
	}
	public set maxInlineSize(maxInlineSize: string) {
		this.setProperty('max-inline-size', maxInlineSize);
	}

	public get maxWidth(): string {
		return this._getProperty('max-width');
	}
	public set maxWidth(maxWidth: string) {
		this.setProperty('max-width', maxWidth);
	}

	public get maxZoom(): string {
		return this._getProperty('max-zoom');
	}
	public set maxZoom(maxZoom: string) {
		this.setProperty('max-zoom', maxZoom);
	}

	public get minBlockSize(): string {
		return this._getProperty('min-block-size');
	}
	public set minBlockSize(minBlockSize: string) {
		this.setProperty('min-block-size', minBlockSize);
	}

	public get minHeight(): string {
		return this._getProperty('min-height');
	}
	public set minHeight(minHeight: string) {
		this.setProperty('min-height', minHeight);
	}

	public get minInlineSize(): string {
		return this._getProperty('min-inline-size');
	}
	public set minInlineSize(minInlineSize: string) {
		this.setProperty('min-inline-size', minInlineSize);
	}

	public get minWidth(): string {
		return this._getProperty('min-width');
	}
	public set minWidth(minWidth: string) {
		this.setProperty('min-width', minWidth);
	}

	public get minZoom(): string {
		return this._getProperty('min-zoom');
	}
	public set minZoom(minZoom: string) {
		this.setProperty('min-zoom', minZoom);
	}

	public get mixBlendMode(): string {
		return this._getProperty('mix-blend-mode');
	}
	public set mixBlendMode(mixBlendMode: string) {
		this.setProperty('mix-blend-mode', mixBlendMode);
	}

	public get objectFit(): string {
		return this._getProperty('object-fit');
	}
	public set objectFit(objectFit: string) {
		this.setProperty('object-fit', objectFit);
	}

	public get objectPosition(): string {
		return this._getProperty('object-position');
	}
	public set objectPosition(objectPosition: string) {
		this.setProperty('object-position', objectPosition);
	}

	public get offset(): string {
		return this._getProperty('offset');
	}
	public set offset(offset: string) {
		this.setProperty('offset', offset);
	}

	public get offsetDistance(): string {
		return this._getProperty('offset-distance');
	}
	public set offsetDistance(offsetDistance: string) {
		this.setProperty('offset-distance', offsetDistance);
	}

	public get offsetPath(): string {
		return this._getProperty('offset-path');
	}
	public set offsetPath(offsetPath: string) {
		this.setProperty('offset-path', offsetPath);
	}

	public get offsetRotate(): string {
		return this._getProperty('offset-rotate');
	}
	public set offsetRotate(offsetRotate: string) {
		this.setProperty('offset-rotate', offsetRotate);
	}

	public get opacity(): string {
		return this._getProperty('opacity');
	}
	public set opacity(opacity: string) {
		this.setProperty('opacity', opacity);
	}

	public get order(): string {
		return this._getProperty('order');
	}
	public set order(order: string) {
		this.setProperty('order', order);
	}

	public get orientation(): string {
		return this._getProperty('orientation');
	}
	public set orientation(orientation: string) {
		this.setProperty('orientation', orientation);
	}

	public get orphans(): string {
		return this._getProperty('orphans');
	}
	public set orphans(orphans: string) {
		this.setProperty('orphans', orphans);
	}

	public get outline(): string {
		return this._getProperty('outline');
	}
	public set outline(outline: string) {
		this.setProperty('outline', outline);
	}

	public get outlineColor(): string {
		return this._getProperty('outline-color');
	}
	public set outlineColor(outlineColor: string) {
		this.setProperty('outline-color', outlineColor);
	}

	public get outlineOffset(): string {
		return this._getProperty('outline-offset');
	}
	public set outlineOffset(outlineOffset: string) {
		this.setProperty('outline-offset', outlineOffset);
	}

	public get outlineStyle(): string {
		return this._getProperty('outline-style');
	}
	public set outlineStyle(outlineStyle: string) {
		this.setProperty('outline-style', outlineStyle);
	}

	public get outlineWidth(): string {
		return this._getProperty('outline-width');
	}
	public set outlineWidth(outlineWidth: string) {
		this.setProperty('outline-width', outlineWidth);
	}

	public get overflow(): string {
		return this._getProperty('overflow');
	}
	public set overflow(overflow: string) {
		this.setProperty('overflow', overflow);
	}

	public get overflowAnchor(): string {
		return this._getProperty('overflow-anchor');
	}
	public set overflowAnchor(overflowAnchor: string) {
		this.setProperty('overflow-anchor', overflowAnchor);
	}

	public get overflowWrap(): string {
		return this._getProperty('overflow-wrap');
	}
	public set overflowWrap(overflowWrap: string) {
		this.setProperty('overflow-wrap', overflowWrap);
	}

	public get overflowX(): string {
		return this._getProperty('overflow-x');
	}
	public set overflowX(overflowX: string) {
		this.setProperty('overflow-x', overflowX);
	}

	public get overflowY(): string {
		return this._getProperty('overflow-y');
	}
	public set overflowY(overflowY: string) {
		this.setProperty('overflow-y', overflowY);
	}

	public get overscrollBehavior(): string {
		return this._getProperty('overscroll-behavior');
	}
	public set overscrollBehavior(overscrollBehavior: string) {
		this.setProperty('overscroll-behavior', overscrollBehavior);
	}

	public get overscrollBehaviorBlock(): string {
		return this._getProperty('overscroll-behavior-block');
	}
	public set overscrollBehaviorBlock(overscrollBehaviorBlock: string) {
		this.setProperty('overscroll-behavior-block', overscrollBehaviorBlock);
	}

	public get overscrollBehaviorInline(): string {
		return this._getProperty('overscroll-behavior-inline');
	}
	public set overscrollBehaviorInline(overscrollBehaviorInline: string) {
		this.setProperty('overscroll-behavior-inline', overscrollBehaviorInline);
	}

	public get overscrollBehaviorX(): string {
		return this._getProperty('overscroll-behavior-x');
	}
	public set overscrollBehaviorX(overscrollBehaviorX: string) {
		this.setProperty('overscroll-behavior-x', overscrollBehaviorX);
	}

	public get overscrollBehaviorY(): string {
		return this._getProperty('overscroll-behavior-y');
	}
	public set overscrollBehaviorY(overscrollBehaviorY: string) {
		this.setProperty('overscroll-behavior-y', overscrollBehaviorY);
	}

	public get padding(): string {
		return this._getProperty('padding');
	}
	public set padding(padding: string) {
		this.setProperty('padding', padding);
	}

	public get paddingBlockEnd(): string {
		return this._getProperty('padding-block-end');
	}
	public set paddingBlockEnd(paddingBlockEnd: string) {
		this.setProperty('padding-block-end', paddingBlockEnd);
	}

	public get paddingBlockStart(): string {
		return this._getProperty('padding-block-start');
	}
	public set paddingBlockStart(paddingBlockStart: string) {
		this.setProperty('padding-block-start', paddingBlockStart);
	}

	public get paddingBottom(): string {
		return this._getProperty('padding-bottom');
	}
	public set paddingBottom(paddingBottom: string) {
		this.setProperty('padding-bottom', paddingBottom);
	}

	public get paddingInlineEnd(): string {
		return this._getProperty('padding-inline-end');
	}
	public set paddingInlineEnd(paddingInlineEnd: string) {
		this.setProperty('padding-inline-end', paddingInlineEnd);
	}

	public get paddingInlineStart(): string {
		return this._getProperty('padding-inline-start');
	}
	public set paddingInlineStart(paddingInlineStart: string) {
		this.setProperty('padding-inline-start', paddingInlineStart);
	}

	public get paddingLeft(): string {
		return this._getProperty('padding-left');
	}
	public set paddingLeft(paddingLeft: string) {
		this.setProperty('padding-left', paddingLeft);
	}

	public get paddingRight(): string {
		return this._getProperty('padding-right');
	}
	public set paddingRight(paddingRight: string) {
		this.setProperty('padding-right', paddingRight);
	}

	public get paddingTop(): string {
		return this._getProperty('padding-top');
	}
	public set paddingTop(paddingTop: string) {
		this.setProperty('padding-top', paddingTop);
	}

	public get page(): string {
		return this._getProperty('page');
	}
	public set page(page: string) {
		this.setProperty('page', page);
	}

	public get pageBreakAfter(): string {
		return this._getProperty('page-break-after');
	}
	public set pageBreakAfter(pageBreakAfter: string) {
		this.setProperty('page-break-after', pageBreakAfter);
	}

	public get pageBreakBefore(): string {
		return this._getProperty('page-break-before');
	}
	public set pageBreakBefore(pageBreakBefore: string) {
		this.setProperty('page-break-before', pageBreakBefore);
	}

	public get pageBreakInside(): string {
		return this._getProperty('page-break-inside');
	}
	public set pageBreakInside(pageBreakInside: string) {
		this.setProperty('page-break-inside', pageBreakInside);
	}

	public get pageOrientation(): string {
		return this._getProperty('page-orientation');
	}
	public set pageOrientation(pageOrientation: string) {
		this.setProperty('page-orientation', pageOrientation);
	}

	public get paintOrder(): string {
		return this._getProperty('paint-order');
	}
	public set paintOrder(paintOrder: string) {
		this.setProperty('paint-order', paintOrder);
	}

	public get perspective(): string {
		return this._getProperty('perspective');
	}
	public set perspective(perspective: string) {
		this.setProperty('perspective', perspective);
	}

	public get perspectiveOrigin(): string {
		return this._getProperty('perspective-origin');
	}
	public set perspectiveOrigin(perspectiveOrigin: string) {
		this.setProperty('perspective-origin', perspectiveOrigin);
	}

	public get placeContent(): string {
		return this._getProperty('place-content');
	}
	public set placeContent(placeContent: string) {
		this.setProperty('place-content', placeContent);
	}

	public get placeItems(): string {
		return this._getProperty('place-items');
	}
	public set placeItems(placeItems: string) {
		this.setProperty('place-items', placeItems);
	}

	public get placeSelf(): string {
		return this._getProperty('place-self');
	}
	public set placeSelf(placeSelf: string) {
		this.setProperty('place-self', placeSelf);
	}

	public get pointerEvents(): string {
		return this._getProperty('pointer-events');
	}
	public set pointerEvents(pointerEvents: string) {
		this.setProperty('pointer-events', pointerEvents);
	}

	public get position(): string {
		return this._getProperty('position');
	}
	public set position(position: string) {
		this.setProperty('position', position);
	}

	public get quotes(): string {
		return this._getProperty('quotes');
	}
	public set quotes(quotes: string) {
		this.setProperty('quotes', quotes);
	}

	public get r(): string {
		return this._getProperty('r');
	}
	public set r(r: string) {
		this.setProperty('r', r);
	}

	public get resize(): string {
		return this._getProperty('resize');
	}
	public set resize(resize: string) {
		this.setProperty('resize', resize);
	}

	public get right(): string {
		return this._getProperty('right');
	}
	public set right(right: string) {
		this.setProperty('right', right);
	}

	public get rowGap(): string {
		return this._getProperty('row-gap');
	}
	public set rowGap(rowGap: string) {
		this.setProperty('row-gap', rowGap);
	}

	public get rubyPosition(): string {
		return this._getProperty('ruby-position');
	}
	public set rubyPosition(rubyPosition: string) {
		this.setProperty('ruby-position', rubyPosition);
	}

	public get rx(): string {
		return this._getProperty('rx');
	}
	public set rx(rx: string) {
		this.setProperty('rx', rx);
	}

	public get ry(): string {
		return this._getProperty('ry');
	}
	public set ry(ry: string) {
		this.setProperty('ry', ry);
	}

	public get scrollBehavior(): string {
		return this._getProperty('scroll-behavior');
	}
	public set scrollBehavior(scrollBehavior: string) {
		this.setProperty('scroll-behavior', scrollBehavior);
	}

	public get scrollMargin(): string {
		return this._getProperty('scroll-margin');
	}
	public set scrollMargin(scrollMargin: string) {
		this.setProperty('scroll-margin', scrollMargin);
	}

	public get scrollMarginBlock(): string {
		return this._getProperty('scroll-margin-block');
	}
	public set scrollMarginBlock(scrollMarginBlock: string) {
		this.setProperty('scroll-margin-block', scrollMarginBlock);
	}

	public get scrollMarginBlockEnd(): string {
		return this._getProperty('scroll-margin-block-end');
	}
	public set scrollMarginBlockEnd(scrollMarginBlockEnd: string) {
		this.setProperty('scroll-margin-block-end', scrollMarginBlockEnd);
	}

	public get scrollMarginBlockStart(): string {
		return this._getProperty('scroll-margin-block-start');
	}
	public set scrollMarginBlockStart(scrollMarginBlockStart: string) {
		this.setProperty('scroll-margin-block-start', scrollMarginBlockStart);
	}

	public get scrollMarginBottom(): string {
		return this._getProperty('scroll-margin-bottom');
	}
	public set scrollMarginBottom(scrollMarginBottom: string) {
		this.setProperty('scroll-margin-bottom', scrollMarginBottom);
	}

	public get scrollMarginInline(): string {
		return this._getProperty('scroll-margin-inline');
	}
	public set scrollMarginInline(scrollMarginInline: string) {
		this.setProperty('scroll-margin-inline', scrollMarginInline);
	}

	public get scrollMarginInlineEnd(): string {
		return this._getProperty('scroll-margin-inline-end');
	}
	public set scrollMarginInlineEnd(scrollMarginInlineEnd: string) {
		this.setProperty('scroll-margin-inline-end', scrollMarginInlineEnd);
	}

	public get scrollMarginInlineStart(): string {
		return this._getProperty('scroll-margin-inline-start');
	}
	public set scrollMarginInlineStart(scrollMarginInlineStart: string) {
		this.setProperty('scroll-margin-inline-start', scrollMarginInlineStart);
	}

	public get scrollMarginLeft(): string {
		return this._getProperty('scroll-margin-left');
	}
	public set scrollMarginLeft(scrollMarginLeft: string) {
		this.setProperty('scroll-margin-left', scrollMarginLeft);
	}

	public get scrollMarginRight(): string {
		return this._getProperty('scroll-margin-right');
	}
	public set scrollMarginRight(scrollMarginRight: string) {
		this.setProperty('scroll-margin-right', scrollMarginRight);
	}

	public get scrollMarginTop(): string {
		return this._getProperty('scroll-margin-top');
	}
	public set scrollMarginTop(scrollMarginTop: string) {
		this.setProperty('scroll-margin-top', scrollMarginTop);
	}

	public get scrollPadding(): string {
		return this._getProperty('scroll-padding');
	}
	public set scrollPadding(scrollPadding: string) {
		this.setProperty('scroll-padding', scrollPadding);
	}

	public get scrollPaddingBlock(): string {
		return this._getProperty('scroll-padding-block');
	}
	public set scrollPaddingBlock(scrollPaddingBlock: string) {
		this.setProperty('scroll-padding-block', scrollPaddingBlock);
	}

	public get scrollPaddingBlockEnd(): string {
		return this._getProperty('scroll-padding-block-end');
	}
	public set scrollPaddingBlockEnd(scrollPaddingBlockEnd: string) {
		this.setProperty('scroll-padding-block-end', scrollPaddingBlockEnd);
	}

	public get scrollPaddingBlockStart(): string {
		return this._getProperty('scroll-padding-block-start');
	}
	public set scrollPaddingBlockStart(scrollPaddingBlockStart: string) {
		this.setProperty('scroll-padding-block-start', scrollPaddingBlockStart);
	}

	public get scrollPaddingBottom(): string {
		return this._getProperty('scroll-padding-bottom');
	}
	public set scrollPaddingBottom(scrollPaddingBottom: string) {
		this.setProperty('scroll-padding-bottom', scrollPaddingBottom);
	}

	public get scrollPaddingInline(): string {
		return this._getProperty('scroll-padding-inline');
	}
	public set scrollPaddingInline(scrollPaddingInline: string) {
		this.setProperty('scroll-padding-inline', scrollPaddingInline);
	}

	public get scrollPaddingInlineEnd(): string {
		return this._getProperty('scroll-padding-inline-end');
	}
	public set scrollPaddingInlineEnd(scrollPaddingInlineEnd: string) {
		this.setProperty('scroll-padding-inline-end', scrollPaddingInlineEnd);
	}

	public get scrollPaddingInlineStart(): string {
		return this._getProperty('scroll-padding-inline-start');
	}
	public set scrollPaddingInlineStart(scrollPaddingInlineStart: string) {
		this.setProperty('scroll-padding-inline-start', scrollPaddingInlineStart);
	}

	public get scrollPaddingLeft(): string {
		return this._getProperty('scroll-padding-left');
	}
	public set scrollPaddingLeft(scrollPaddingLeft: string) {
		this.setProperty('scroll-padding-left', scrollPaddingLeft);
	}

	public get scrollPaddingRight(): string {
		return this._getProperty('scroll-padding-right');
	}
	public set scrollPaddingRight(scrollPaddingRight: string) {
		this.setProperty('scroll-padding-right', scrollPaddingRight);
	}

	public get scrollPaddingTop(): string {
		return this._getProperty('scroll-padding-top');
	}
	public set scrollPaddingTop(scrollPaddingTop: string) {
		this.setProperty('scroll-padding-top', scrollPaddingTop);
	}

	public get scrollSnapAlign(): string {
		return this._getProperty('scroll-snap-align');
	}
	public set scrollSnapAlign(scrollSnapAlign: string) {
		this.setProperty('scroll-snap-align', scrollSnapAlign);
	}

	public get scrollSnapStop(): string {
		return this._getProperty('scroll-snap-stop');
	}
	public set scrollSnapStop(scrollSnapStop: string) {
		this.setProperty('scroll-snap-stop', scrollSnapStop);
	}

	public get scrollSnapType(): string {
		return this._getProperty('scroll-snap-type');
	}
	public set scrollSnapType(scrollSnapType: string) {
		this.setProperty('scroll-snap-type', scrollSnapType);
	}

	public get shapeImageThreshold(): string {
		return this._getProperty('shape-image-threshold');
	}
	public set shapeImageThreshold(shapeImageThreshold: string) {
		this.setProperty('shape-image-threshold', shapeImageThreshold);
	}

	public get shapeMargin(): string {
		return this._getProperty('shape-margin');
	}
	public set shapeMargin(shapeMargin: string) {
		this.setProperty('shape-margin', shapeMargin);
	}

	public get shapeOutside(): string {
		return this._getProperty('shape-outside');
	}
	public set shapeOutside(shapeOutside: string) {
		this.setProperty('shape-outside', shapeOutside);
	}

	public get shapeRendering(): string {
		return this._getProperty('shape-rendering');
	}
	public set shapeRendering(shapeRendering: string) {
		this.setProperty('shape-rendering', shapeRendering);
	}

	public get size(): string {
		return this._getProperty('size');
	}
	public set size(size: string) {
		this.setProperty('size', size);
	}

	public get speak(): string {
		return this._getProperty('speak');
	}
	public set speak(speak: string) {
		this.setProperty('speak', speak);
	}

	public get src(): string {
		return this._getProperty('src');
	}
	public set src(src: string) {
		this.setProperty('src', src);
	}

	public get stopColor(): string {
		return this._getProperty('stop-color');
	}
	public set stopColor(stopColor: string) {
		this.setProperty('stop-color', stopColor);
	}

	public get stopOpacity(): string {
		return this._getProperty('stop-opacity');
	}
	public set stopOpacity(stopOpacity: string) {
		this.setProperty('stop-opacity', stopOpacity);
	}

	public get stroke(): string {
		return this._getProperty('stroke');
	}
	public set stroke(stroke: string) {
		this.setProperty('stroke', stroke);
	}

	public get strokeDasharray(): string {
		return this._getProperty('stroke-dasharray');
	}
	public set strokeDasharray(strokeDasharray: string) {
		this.setProperty('stroke-dasharray', strokeDasharray);
	}

	public get strokeDashoffset(): string {
		return this._getProperty('stroke-dashoffset');
	}
	public set strokeDashoffset(strokeDashoffset: string) {
		this.setProperty('stroke-dashoffset', strokeDashoffset);
	}

	public get strokeLinecap(): string {
		return this._getProperty('stroke-linecap');
	}
	public set strokeLinecap(strokeLinecap: string) {
		this.setProperty('stroke-linecap', strokeLinecap);
	}

	public get strokeLinejoin(): string {
		return this._getProperty('stroke-linejoin');
	}
	public set strokeLinejoin(strokeLinejoin: string) {
		this.setProperty('stroke-linejoin', strokeLinejoin);
	}

	public get strokeMiterlimit(): string {
		return this._getProperty('stroke-miterlimit');
	}
	public set strokeMiterlimit(strokeMiterlimit: string) {
		this.setProperty('stroke-miterlimit', strokeMiterlimit);
	}

	public get strokeOpacity(): string {
		return this._getProperty('stroke-opacity');
	}
	public set strokeOpacity(strokeOpacity: string) {
		this.setProperty('stroke-opacity', strokeOpacity);
	}

	public get strokeWidth(): string {
		return this._getProperty('stroke-width');
	}
	public set strokeWidth(strokeWidth: string) {
		this.setProperty('stroke-width', strokeWidth);
	}

	public get syntax(): string {
		return this._getProperty('syntax');
	}
	public set syntax(syntax: string) {
		this.setProperty('syntax', syntax);
	}

	public get tabSize(): string {
		return this._getProperty('tab-size');
	}
	public set tabSize(tabSize: string) {
		this.setProperty('tab-size', tabSize);
	}

	public get tableLayout(): string {
		return this._getProperty('table-layout');
	}
	public set tableLayout(tableLayout: string) {
		this.setProperty('table-layout', tableLayout);
	}

	public get textAlign(): string {
		return this._getProperty('text-align');
	}
	public set textAlign(textAlign: string) {
		this.setProperty('text-align', textAlign);
	}

	public get textAlignLast(): string {
		return this._getProperty('text-align-last');
	}
	public set textAlignLast(textAlignLast: string) {
		this.setProperty('text-align-last', textAlignLast);
	}

	public get textAnchor(): string {
		return this._getProperty('text-anchor');
	}
	public set textAnchor(textAnchor: string) {
		this.setProperty('text-anchor', textAnchor);
	}

	public get textCombineUpright(): string {
		return this._getProperty('text-combine-upright');
	}
	public set textCombineUpright(textCombineUpright: string) {
		this.setProperty('text-combine-upright', textCombineUpright);
	}

	public get textDecoration(): string {
		return this._getProperty('text-decoration');
	}
	public set textDecoration(textDecoration: string) {
		this.setProperty('text-decoration', textDecoration);
	}

	public get textDecorationColor(): string {
		return this._getProperty('text-decoration-color');
	}
	public set textDecorationColor(textDecorationColor: string) {
		this.setProperty('text-decoration-color', textDecorationColor);
	}

	public get textDecorationLine(): string {
		return this._getProperty('text-decoration-line');
	}
	public set textDecorationLine(textDecorationLine: string) {
		this.setProperty('text-decoration-line', textDecorationLine);
	}

	public get textDecorationSkipInk(): string {
		return this._getProperty('text-decoration-skip-ink');
	}
	public set textDecorationSkipInk(textDecorationSkipInk: string) {
		this.setProperty('text-decoration-skip-ink', textDecorationSkipInk);
	}

	public get textDecorationStyle(): string {
		return this._getProperty('text-decoration-style');
	}
	public set textDecorationStyle(textDecorationStyle: string) {
		this.setProperty('text-decoration-style', textDecorationStyle);
	}

	public get textIndent(): string {
		return this._getProperty('text-indent');
	}
	public set textIndent(textIndent: string) {
		this.setProperty('text-indent', textIndent);
	}

	public get textOrientation(): string {
		return this._getProperty('text-orientation');
	}
	public set textOrientation(textOrientation: string) {
		this.setProperty('text-orientation', textOrientation);
	}

	public get textOverflow(): string {
		return this._getProperty('text-overflow');
	}
	public set textOverflow(textOverflow: string) {
		this.setProperty('text-overflow', textOverflow);
	}

	public get textRendering(): string {
		return this._getProperty('text-rendering');
	}
	public set textRendering(textRendering: string) {
		this.setProperty('text-rendering', textRendering);
	}

	public get textShadow(): string {
		return this._getProperty('text-shadow');
	}
	public set textShadow(textShadow: string) {
		this.setProperty('text-shadow', textShadow);
	}

	public get textSizeAdjust(): string {
		return this._getProperty('text-size-adjust');
	}
	public set textSizeAdjust(textSizeAdjust: string) {
		this.setProperty('text-size-adjust', textSizeAdjust);
	}

	public get textTransform(): string {
		return this._getProperty('text-transform');
	}
	public set textTransform(textTransform: string) {
		this.setProperty('text-transform', textTransform);
	}

	public get textUnderlinePosition(): string {
		return this._getProperty('text-underline-position');
	}
	public set textUnderlinePosition(textUnderlinePosition: string) {
		this.setProperty('text-underline-position', textUnderlinePosition);
	}

	public get top(): string {
		return this._getProperty('top');
	}
	public set top(top: string) {
		this.setProperty('top', top);
	}

	public get touchAction(): string {
		return this._getProperty('touch-action');
	}
	public set touchAction(touchAction: string) {
		this.setProperty('touch-action', touchAction);
	}

	public get transform(): string {
		return this._getProperty('transform');
	}
	public set transform(transform: string) {
		this.setProperty('transform', transform);
	}

	public get transformBox(): string {
		return this._getProperty('transform-box');
	}
	public set transformBox(transformBox: string) {
		this.setProperty('transform-box', transformBox);
	}

	public get transformOrigin(): string {
		return this._getProperty('transform-origin');
	}
	public set transformOrigin(transformOrigin: string) {
		this.setProperty('transform-origin', transformOrigin);
	}

	public get transformStyle(): string {
		return this._getProperty('transform-style');
	}
	public set transformStyle(transformStyle: string) {
		this.setProperty('transform-style', transformStyle);
	}

	public get transition(): string {
		return this._getProperty('transition');
	}
	public set transition(transition: string) {
		this.setProperty('transition', transition);
	}

	public get transitionDelay(): string {
		return this._getProperty('transition-delay');
	}
	public set transitionDelay(transitionDelay: string) {
		this.setProperty('transition-delay', transitionDelay);
	}

	public get transitionDuration(): string {
		return this._getProperty('transition-duration');
	}
	public set transitionDuration(transitionDuration: string) {
		this.setProperty('transition-duration', transitionDuration);
	}

	public get transitionProperty(): string {
		return this._getProperty('transition-property');
	}
	public set transitionProperty(transitionProperty: string) {
		this.setProperty('transition-property', transitionProperty);
	}

	public get transitionTimingFunction(): string {
		return this._getProperty('transition-timing-function');
	}
	public set transitionTimingFunction(transitionTimingFunction: string) {
		this.setProperty('transition-timing-function', transitionTimingFunction);
	}

	public get unicodeBidi(): string {
		return this._getProperty('unicode-bidi');
	}
	public set unicodeBidi(unicodeBidi: string) {
		this.setProperty('unicode-bidi', unicodeBidi);
	}

	public get unicodeRange(): string {
		return this._getProperty('unicode-range');
	}
	public set unicodeRange(unicodeRange: string) {
		this.setProperty('unicode-range', unicodeRange);
	}

	public get userSelect(): string {
		return this._getProperty('user-select');
	}
	public set userSelect(userSelect: string) {
		this.setProperty('user-select', userSelect);
	}

	public get userZoom(): string {
		return this._getProperty('user-zoom');
	}
	public set userZoom(userZoom: string) {
		this.setProperty('user-zoom', userZoom);
	}

	public get vectorEffect(): string {
		return this._getProperty('vector-effect');
	}
	public set vectorEffect(vectorEffect: string) {
		this.setProperty('vector-effect', vectorEffect);
	}

	public get verticalAlign(): string {
		return this._getProperty('vertical-align');
	}
	public set verticalAlign(verticalAlign: string) {
		this.setProperty('vertical-align', verticalAlign);
	}

	public get visibility(): string {
		return this._getProperty('visibility');
	}
	public set visibility(visibility: string) {
		this.setProperty('visibility', visibility);
	}

	public get whiteSpace(): string {
		return this._getProperty('white-space');
	}
	public set whiteSpace(whiteSpace: string) {
		this.setProperty('white-space', whiteSpace);
	}

	public get widows(): string {
		return this._getProperty('widows');
	}
	public set widows(widows: string) {
		this.setProperty('widows', widows);
	}

	public get width(): string {
		return this._getProperty('width');
	}
	public set width(width: string) {
		this.setProperty('width', width);
	}

	public get willChange(): string {
		return this._getProperty('will-change');
	}
	public set willChange(willChange: string) {
		this.setProperty('will-change', willChange);
	}

	public get wordBreak(): string {
		return this._getProperty('word-break');
	}
	public set wordBreak(wordBreak: string) {
		this.setProperty('word-break', wordBreak);
	}

	public get wordSpacing(): string {
		return this._getProperty('word-spacing');
	}
	public set wordSpacing(wordSpacing: string) {
		this.setProperty('word-spacing', wordSpacing);
	}

	public get wordWrap(): string {
		return this._getProperty('word-wrap');
	}
	public set wordWrap(wordWrap: string) {
		this.setProperty('word-wrap', wordWrap);
	}

	public get writingMode(): string {
		return this._getProperty('writing-mode');
	}
	public set writingMode(writingMode: string) {
		this.setProperty('writing-mode', writingMode);
	}

	public get x(): string {
		return this._getProperty('x');
	}
	public set x(x: string) {
		this.setProperty('x', x);
	}

	public get y(): string {
		return this._getProperty('y');
	}
	public set y(y: string) {
		this.setProperty('y', y);
	}

	public get zIndex(): string {
		return this._getProperty('z-index');
	}
	public set zIndex(zIndex: string) {
		this.setProperty('z-index', zIndex);
	}

	public get zoom(): string {
		return this._getProperty('zoom');
	}
	public set zoom(zoom: string) {
		this.setProperty('zoom', zoom);
	}

	/* eslint-enable require-jsdoc */

	/**
	 * Returns the style decleration as a CSS text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		const style = this._attributes['style'];
		if (style && style.value) {
			return style.value;
		}
		return '';
	}

	/**
	 * Sets CSS text.
	 *
	 * @param cssText CSS text.
	 */
	public set cssText(cssText: string) {
		if (cssText) {
			if (!this._attributes['style']) {
				this._attributes['style'] = new Attr();
				this._attributes['style'].name = 'style';
			}
			const parts = cssText.split(';');
			const newStyle = [];
			let index = 0;
			for (let i = 0; i < this.length; i++) {
				delete this[i];
			}
			for (const part of parts) {
				if (part) {
					const [name, value] = part.trim().split(':');
					newStyle.push(`${name}: ${value.trim()};`);
					this[index] = name;
					index++;
				}
			}
			(<number>this.length) = index;
			this._attributes['style'].value = newStyle.join(' ');
		} else {
			delete this._attributes['style'];
			for (let i = 0; i < this.length; i++) {
				delete this[i];
			}
			(<number>this.length) = 0;
		}
	}

	/**
	 * Constructor.
	 *
	 * @param [attributes] Attributes.
	 * @param [computedStyleElement] Computed style element.
	 */
	constructor(
		attributes: { [k: string]: Attr } = {},
		computedStyleElement: { isConnected: boolean } = null
	) {
		const style = attributes['style'];
		let index = 0;

		this._attributes = attributes;
		this._computedStyleElement = computedStyleElement;

		if (style && style.value) {
			const parts = style.value.split(';');
			for (const part of parts) {
				if (part) {
					const [name] = part.trim().split(':');
					this[index] = name;
					index++;
				}
			}
		}

		(<number>this.length) = index;
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
		if (!value) {
			this.removeProperty(propertyName);
			return;
		}

		if (!this._attributes['style']) {
			this._attributes['style'] = new Attr();
			this._attributes['style'].name = 'style';
		}

		const style = this._attributes['style'];
		const newStyle = [];
		let index = 0;
		let isExisting = false;

		if (style && style.value) {
			const parts = style.value.split(';');
			for (const part of parts) {
				if (part) {
					const [name, existingValue] = part.trim().split(':');
					if (name === propertyName) {
						newStyle.push(`${name}: ${value};`);
						isExisting = true;
					} else {
						newStyle.push(`${name}: ${existingValue.trim()};`);
					}

					this[index] = name;
					index++;
				}
			}
		}

		if (!isExisting) {
			newStyle.push(`${propertyName}: ${value}${priority ? '' + priority : ''};`);
			this[index] = propertyName;
			index++;
		}

		this._attributes['style'].value = newStyle.join(' ');
		(<number>this.length) = index;
	}

	/**
	 * Removes a property.
	 *
	 * @param propertyName Property name in kebab case.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public removeProperty(propertyName: string): void {
		const style = this._attributes['style'];
		const newStyle = [];
		let hasProperty = false;
		let index = 0;

		if (style && style.value) {
			const parts = style.value.split(';');
			for (const part of parts) {
				if (part) {
					const [name, value] = part.trim().split(':');
					if (name !== propertyName) {
						newStyle.push(`${name}: ${value.trim()};`);
						this[index] = name;
						index++;
						hasProperty = true;
					}
				}
			}
		}

		if (newStyle.length) {
			this._attributes['style'].value = newStyle.join(' ');
		} else {
			delete this._attributes['style'];
		}

		if (hasProperty) {
			delete this[index];
		}

		(<number>this.length) = index;
	}

	/**
	 * Returns a property.
	 *
	 * @param propertyName Property name in kebab case.
	 * @returns Property value.
	 */
	private _getProperty(propertyName: string): string {
		if (this._computedStyleElement && !this._computedStyleElement.isConnected) {
			return '';
		}

		const style = this._attributes['style'];
		if (style && style.value) {
			const parts = style.value.split(';');
			for (const part of parts) {
				if (part) {
					const [name, value] = part.trim().split(':');
					if (name === propertyName) {
						return value.trim();
					}
				}
			}
		}
		return '';
	}
}
