
    import HTMLProgressElement from '../../../src/nodes/html-progress-element/HTMLProgressElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLProgressElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLProgressElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('progress');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLProgressElement', () => {
                expect(element instanceof HTMLProgressElement).toBe(true);
            });
        });
    });
    