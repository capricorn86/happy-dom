
    import HTMLMapElement from '../../../src/nodes/html-map-element/HTMLMapElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLMapElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLMapElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('map');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLMapElement', () => {
                expect(element instanceof HTMLMapElement).toBe(true);
            });
        });
    });
    