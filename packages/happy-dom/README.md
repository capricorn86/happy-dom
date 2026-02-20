![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

A JavaScript implementation of a web browser without its graphical user interface.

## DOM Features

- Custom Elements (Web Components)

- Declarative Shadow DOM

- Mutation Observer

- Tree Walker

- Fetch API

And much more..

## Canvas Support

Happy DOM provides a pluggable canvas adapter for real canvas rendering. By default, canvas operations return empty values to keep Happy DOM lightweight.

To enable real canvas rendering, use the `@happy-dom/node-canvas-adapter` package:

```bash
npm install @happy-dom/node-canvas-adapter canvas
```

```typescript
import { Window } from 'happy-dom';
import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';

const window = new Window({
  settings: {
    canvasAdapter: new CanvasAdapter()
  }
});

const canvas = window.document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Now you can use canvas context
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

const dataURL = canvas.toDataURL();
```

You can also create your own adapter by implementing the `ICanvasAdapter` interface.

## Documentation

[Documentation](https://github.com/capricorn86/happy-dom/wiki/) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)

## Works With

[Vitest](https://vitest.dev/) | [Bun](https://bun.sh) | [Jest](https://jestjs.io/) | [Testing Library](https://testing-library.com/) | [Google LitElement](https://lit.dev/) | [Vue](https://vuejs.org/) | [React](https://reactjs.org) | [Svelte](https://svelte.dev/) | [Angular](https://angular.dev/)

## Module Systems

[ESM](https://nodejs.org/api/esm.html#introduction) | [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)

## Performance

| Operation                            | JSDOM   | Happy DOM |
| ------------------------------------ | ------- | --------- |
| Import / Require                     | 333 ms  | 45 ms     |
| Parse HTML                           | 256 ms  | 26 ms     |
| Serialize HTML                       | 65 ms   | 8 ms      |
| Render custom element                | 214 ms  | 19 ms     |
| querySelectorAll('tagname')          | 4.9 ms  | 0.7 ms    |
| querySelectorAll(':nth-child(2n+1)') | 10.4 ms | 3.8 ms    |

See how the test was done [here](https://github.com/capricorn86/happy-dom-performance-test)