![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

# About

[Happy DOM](https://github.com/capricorn86/happy-dom) is a JavaScript implementation of a web browser without its graphical user interface. It includes many web standards from WHATWG [DOM](https://dom.spec.whatwg.org/) and [HTML](https://html.spec.whatwg.org/multipage/).

The goal of [Happy DOM](https://github.com/capricorn86/happy-dom) is to emulate enough of a web browser to be useful for testing, scraping web sites and server-side rendering.

[Happy DOM](https://github.com/capricorn86/happy-dom) focuses heavily on performance and can be used as an alternative to [JSDOM](https://github.com/jsdom/jsdom).

### DOM Features

-   Custom Elements (Web Components)

-   Shadow Root (Shadow DOM)

-   Declarative Shadow DOM

-   Mutation Observer

-   Tree Walker

-   Fetch

And much more..

### Works With

-   [Google LitHTML](https://lit-html.polymer-project.org)

-   [Google LitElement](https://lit-element.polymer-project.org)

-   [React](https://reactjs.org)

-   [Angular](https://angular.io/)

-   [Vue](https://vuejs.org/)

### Module Systems

-   [ESM](https://nodejs.org/api/esm.html#introduction)
-   [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules).

# Documentation

Read more about how to use Happy DOM in our [Wiki](https://github.com/capricorn86/happy-dom/wiki).

# Packages

This repository is a _Monorepo_. Each package lives under `packages/<package>`.

### [![Published on npm](https://img.shields.io/npm/v/happy-dom.svg)](https://www.npmjs.com/package/happy-dom) [happy-dom](https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom)

This package contains the core functionality of Happy DOM.

---

### [![Published on npm](https://img.shields.io/npm/v/@happy-dom/jest-environment.svg)](https://www.npmjs.com/package/@happy-dom/jest-environment) [jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment)

This package makes it possible to use Happy DOM with [Jest](https://jestjs.io/).

---

### [![Published on npm](https://img.shields.io/npm/v/@happy-dom/global-registrator.svg)](https://www.npmjs.com/package/@happy-dom/global-registrator) [global-registrator](https://github.com/capricorn86/happy-dom/tree/master/packages/global-registrator)

A utility that registers Happy DOM globally, which makes it possible to use Happy DOM for testing in a Node environment.

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

# Contributing

See [Contributing Guide](https://github.com/capricorn86/happy-dom/blob/master/docs/contributing.md).

# Sponsors

[<img alt="RTVision" width="120px" src="https://avatars.githubusercontent.com/u/8292810?s=200&v=4" />](https://rtvision.com)
