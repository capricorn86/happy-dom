
    import HTMLAreaElement from '../../../src/nodes/html-area-element/HTMLAreaElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLAreaElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLAreaElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('area');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLAreaElement', () => {
                expect(element instanceof HTMLAreaElement).toBe(true);
            });
        });
    });
    