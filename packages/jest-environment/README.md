![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)


# About

A [JSDOM](https://github.com/jsdom/jsdom) alternative with support for server side rendering of web components.

[Happy DOM](https://github.com/capricorn86/happy-dom) aim to support the most common functionality of a web browser.

This package makes it possible to use [Happy DOM](https://github.com/capricorn86/happy-dom) with [Jest](https://jestjs.io/).


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

  


# Installation

```bash
npm install @happy-dom/jest-environment --save-dev
```




# Setup

Jest uses [JSDOM](https://github.com/jsdom/jsdom) as test environment by default. In order to tell Jest to use a different environment we will either have to set a CLI attribute, define it in "package.json" or add a property to your Jest config file.



## CLI

1. Edit your "package.json" file.
2. Add "--env=@happy-dom/jest-environment" as an attribute to your Jest command.

    ```json
    {
        "scripts": {
            "test": "jest --env=@happy-dom/jest-environment"
        }
    }
    ```

3. Save the file.


## In "package.json"

1. Edit your "package.json" file.
2. Add the following to it:

    ```json
    {
        "jest": {
            "testEnvironment": "@happy-dom/jest-environment"
        }
    }
    ```

3. Save the file.



## Configuration File
1. Edit your Jest config file (usually jest.config.js)
2. Add the following to it:

    ```json
    {
      "testEnvironment": "@happy-dom/jest-environment"
    }
    ```

3. Save the file.



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

