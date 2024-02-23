![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

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
npm install happy-dom
```

# Usage

Happy DOM can be used as a simulated [Browser](https://github.com/capricorn86/happy-dom/wiki/Browser) or by using the [Window](https://github.com/capricorn86/happy-dom/wiki/Window) class directly to quickly setup up a DOM.

## Window

```javascript
import { Window } from 'happy-dom';

const window = new Window({ url: 'https://localhost:8080' });
const document = window.document;

document.body.innerHTML = '<div class="container"></div>';

const container = document.querySelector('.container');
const button = document.createElement('button');

container.appendChild(button);

// Outputs "<div class="container"><button></button></div>"
console.log(document.body.innerHTML);

// Closes the window
await window.happyDOM.close();
```

## Browser

```javascript
import { Browser, BrowserErrorCaptureEnum } from 'happy-dom';

const browser = new Browser({ settings: { errorCapture: BrowserErrorCaptureEnum.processLevel } });
const page = browser.newPage();

// Navigates page
await page.goto('https://github.com/capricorn86');

// Clicks on link
page.mainFrame.document.querySelector('a[href*="capricorn86/happy-dom"]').click();

// Waits for all operations on the page to complete (fetch, timers etc.)
await page.waitUntilComplete();

// Outputs "GitHub - capricorn86/happy-dom: Happy DOM..."
console.log(page.mainFrame.document.title);

// Closes the browser
await browser.close();
```

# Documentation

Read more about how to use Happy DOM in our [Wiki](https://github.com/capricorn86/happy-dom/wiki).

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

# Jest

Happy DOM provide with a package called [@happy-dom/jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment) that makes it possible to use Happy DOM with [Jest](https://jestjs.io/).

# Vitest

[Vitest](https://github.com/vitest-dev/vitest) supports Happy DOM out of the box.

# Global Registration

Happy DOM provide with a package called [@happy-dom/global-registrator](https://github.com/capricorn86/happy-dom/tree/master/packages/global-registrator) that can register Happy DOM globally. It makes it possible to use Happy DOM for testing in a Node environment.

# Sister Projects

[<img alt="Happy Conventional Commit" width="120px" src="https://raw.githubusercontent.com/capricorn86/happy-conventional-commit/main/docs/logo_thumbnail.jpg" />](https://github.com/capricorn86/happy-conventional-commit)

# Sponsors

[<img alt="RTVision" width="120px" src="https://avatars.githubusercontent.com/u/8292810?s=200&v=4" />](https://rtvision.com)
