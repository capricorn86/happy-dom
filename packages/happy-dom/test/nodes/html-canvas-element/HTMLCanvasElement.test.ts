
    import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
    import Window from '../../../src/window/Window.js';
    import Document from '../../../src/nodes/document/Document.js';
    import { beforeEach, describe, it, expect } from 'vitest';
    
    describe('HTMLCanvasElement', () => {
        let window: Window;
        let document: Document;
        let element: HTMLCanvasElement;
    
        beforeEach(() => {
            window = new Window();
            document = window.document;
            element = document.createElement('canvas');
        });

        describe('constructor()', () => {
            it('Should be an instanceof HTMLCanvasElement', () => {
                expect(element instanceof HTMLCanvasElement).toBe(true);
            });
        });
    });
    