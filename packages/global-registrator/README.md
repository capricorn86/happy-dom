![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)


# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

This package contains a utility that registers [Happy DOM](https://github.com/capricorn86/happy-dom) globally, which makes it possible to use [Happy DOM](https://github.com/capricorn86/happy-dom) for testing in a Node environment.


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

  


# Installation

```bash
npm install @happy-dom/global-registrator --save-dev
```




# Usage

## Register

```javascript
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

document.body.innerHTML = `<button>My button</button>`;

const button = document.querySelector('button');

// Outputs: "My button"
console.log(button.innerText)
```

## Unregister

```javascript
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

GlobalRegistrator.unregister();

// Outputs: "undefined"
console.log(global.document)
```


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

[See how the test was done here](https://github.com/capricorn86/happy-dom-performance-test)

