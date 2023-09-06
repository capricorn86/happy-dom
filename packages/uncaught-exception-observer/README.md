![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

This package contains a tool that observes uncaught exceptions and Promise rejections in [Happy DOM](https://github.com/capricorn86/happy-dom). It will dispatch uncaught errors as events on the [Happy DOM](https://github.com/capricorn86/happy-dom) Window instance.

Uncaught exceptions and rejections must be listened to on the NodeJS process at a global level. This tool will therefore not work in all environments as there may already be listeners added by other libraries on the NodeJS process that may conflict.

### DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

- Declarative Shadow DOM

- Mutation Observer

- Tree Walker

- Fetch

And much more..

### Works With

- [Google LitHTML](https://lit-html.polymer-project.org)

- [Google LitElement](https://lit-element.polymer-project.org)

- [React](https://reactjs.org)

- [Angular](https://angular.io/)

- [Vue](https://vuejs.org/)

### Module Systems

- [ESM](https://nodejs.org/api/esm.html#introduction)
- [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)

# Installation

```bash
npm install happy-dom @happy-dom/uncaught-exception-observer
```

# Usage

```javascript
import { Window } from 'happy-dom';
import { UncaughtExceptionObserver } from '@happy-dom/uncaught-exception-observer';

const window = new Window();
const document = window.document;
const observer = new UncaughtExceptionObserver();

// Connects observer
observer.observe(window);

window.addEventListener((error) => {
	// Do something on error
});

document.write(`
    <script>
        (() => {
            async function main() {
                await fetch('https://localhost:3000/')
                throw Error('This error will be caught, but would otherwise have terminated the process.');
            }

            main();
        })();
    </script>
`);

// Disconnects observer
observer.disconnect();
```

# Documentation

Read more about how Happy DOM works in our [documentation](https://github.com/capricorn86/happy-dom/wiki).

# Performance

| Operation                            | JSDOM   | Happy DOM |
| ------------------------------------ | ------- | --------- |
| Import / Require                     | 333 ms  | 45 ms     |
| Parse HTML                           | 256 ms  | 26 ms     |
| Serialize HTML                       | 65 ms   | 8 ms      |
| Render custom element                | 214 ms  | 19 ms     |
| querySelectorAll('tagname')          | 4.9 ms  | 0.7 ms    |
| querySelectorAll('.class')           | 6.4 ms  | 3.7 ms    |
| querySelectorAll('[attribute]')      | 4.0 ms  | 1.7 ms    |
| querySelectorAll('[class~="name"]')  | 5.5 ms  | 2.9 ms    |
| querySelectorAll(':nth-child(2n+1)') | 10.4 ms | 3.8 ms    |

See how the test was done [here](https://github.com/capricorn86/happy-dom-performance-test)

# Sponsors

[<img alt="RTVision" width="120px" src="https://avatars.githubusercontent.com/u/8292810?s=200&v=4" />](https://rtvision.com)
