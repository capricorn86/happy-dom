import {
	LitElement,
	TemplateResult,
	html,
	css,
	customElement,
	property
} from '../../lib/node_modules/lit-element/lit-element';

@customElement('lit-element-component')
export class LitElementComponent extends LitElement {
	public static styles = css`
		span {
			color: green;
		}
	`;

	@property({ type: 'string' })
	public prop1 = null;

	/**
	 * Renders the component.
	 */
	public render(): TemplateResult {
		return html`
			Some text <span>${this.prop1}</span>!
		`;
	}
}
