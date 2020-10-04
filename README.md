![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)


# About

A [JSDOM](https://github.com/jsdom/jsdom) alternative with support for server side rendering of web components.

Happy DOM aims to support all common functionality of a web browser.


[Read more about how to use Happy DOM](https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom)


### DOM Features

- Custom Elements (Web Components)

- Shadow Root (Shadow DOM)

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



# Packages

This repository is a _Monorepo_. Each package lives under `packages/<package>`.

### [![Published on npm](https://img.shields.io/npm/v/happy-dom.svg)](https://www.npmjs.com/package/happy-dom) [happy-dom](https://github.com/capricorn86/happy-dom/tree/master/packages/happy-dom)

This package contains the core functionality of Happy DOM.

---

### [![Published on npm](https://img.shields.io/npm/v/@happy-dom/jest-environment.svg)](https://www.npmjs.com/package/@happy-dom/jest-environment) [jest-environment](https://github.com/capricorn86/happy-dom/tree/master/packages/jest-environment)

This package makes it possible to use Happy DOM with [Jest](https://jestjs.io/).

---

### [![Published on npm](https://img.shields.io/npm/v/@happy-dom/server-rendering.svg)](https://www.npmjs.com/package/@happy-dom/server-rendering) [server-rendering](https://github.com/capricorn86/happy-dom/tree/master/packages/server-rendering)

This package makes it easier to setup servering side rendering of web components by handling the setup of the Node [VM Context](https://nodejs.org/api/vm.html#vm_vm_createcontext_sandbox_options) for you.



# Whats New in 1.0.0?

- [Lerna](https://lerna.js.org/) is used for managing all packages within a single repository

- Support for [React](https://reactjs.org), [Angular](https://angular.io/), [Vue](https://vuejs.org/)

- Full support for [querySelector()](https://www.w3.org/TR/selectors-api/#queryselector) and [querySelectorAll()](https://www.w3.org/TR/selectors-api/#queryselectorall)

- Server side rendering has been split out to its own package

- All functionality is now covered by unit tests

- Automated release process by publishing to NPM automatically when a pull request is merged

- Release notes are generated automatically by using [Github Releases](https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/about-releases)

- A lot of minor bug fixes



# Contributing

[Read more about how to develop and contribute](https://github.com/capricorn86/happy-dom/blob/master/docs/contributing.md)