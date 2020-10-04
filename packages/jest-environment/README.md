# Happy DOM

A [JSDOM](https://github.com/jsdom/jsdom) alternative with support for server side rendering of web components.

Happy DOM aims to support all common functionality of a web browser.

This package makes it possible to use Happy DOM with [Jest](https://jestjs.io/).


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

  


# Installation

```bash
npm install @happy-dom/jest-environment --save-dev
```




# Setup

Jest uses [JSDOM](https://github.com/jsdom/jsdom) as test environment by default. In order to tell Jest to use a different environment we will either have to set a CLI attribute, define it in "package.json" or add a property your Jest config file.



## CLI

1. Edit your "package.json" file.
2. Add "--env=jest-environment-happy-dom" as an attribute to your Jest command.

    ```json
    {
        "scripts": {
            "test": "jest --env=jest-environment-happy-dom"
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
            "testEnvironment": "jest-environment-happy-dom"
        }
    }
    ```

3. Save the file.



## Configuration File
1. Edit your Jest config file (usually jest.config.js)
2. Add the following to it:

    ```json
    {
      "testEnvironment": "jest-environment-happy-dom"
    }
    ```

3. Save the file.