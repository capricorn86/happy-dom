import type HTMLElement from '../nodes/html-element/HTMLElement.js';

export default interface ICustomElementDefinition {
	elementClass: typeof HTMLElement;
	extends: string | null;
	observedAttributes: Set<string>;
	lifecycleCallbacks: {
		connectedCallback?: () => void;
		disconnectedCallback?: () => void;
		attributeChangedCallback?: (
			name: string,
			oldValue: string | null,
			newValue: string | null
		) => void;
	};
}
