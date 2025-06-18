![Happy DOM Logo](https://github.com/capricorn86/happy-dom/raw/master/docs/happy-dom-logo.jpg)

This package makes it possible to use [Happy DOM](https://github.com/capricorn86/happy-dom) with [Jest](https://jestjs.io/).

## Installation

```bash
npm install @jest/environment @jest/fake-timers @jest/types @jest/mock @jest/util @happy-dom/jest-environment --save-dev
```

## Setup

Jest uses `node` as test environment by default. In order to tell Jest to use a different environment we will either have to set a CLI attribute, define it in "package.json" or add a property to your Jest config file.

#### CLI

When calling the "jest" command, add `--env=@happy-dom/jest-environment` as an attribute.

```bash
jest --env=@happy-dom/jest-environment
```

#### Package.json

It is possible to add your Jest config to your `package.json`.

```json
{
  "jest": {
    "testEnvironment": "@happy-dom/jest-environment"
  }
}
```

#### Jest Config File

When using a Jest config file (usually jest.config.js), add the snippet below to it.

```json
{
  "testEnvironment": "@happy-dom/jest-environment"
}
```

## Options

It is possible to send in Happy DOM [Browser Settings](https://github.com/capricorn86/happy-dom/wiki/IOptionalBrowserSettings) as environment options to [Jest](https://jestjs.io/).

```json
{
  "testEnvironment": "@happy-dom/jest-environment",
  "testEnvironmentOptions": {
    "url": "http://localhost",
    "width": 1920,
    "height": 1080,
    "settings": {
      "navigator": {
         "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }
    }
  }
}
```

## Happy DOM

[Documentation](https://github.com/capricorn86/happy-dom/wiki/) | [Getting Started](https://github.com/capricorn86/happy-dom/wiki/Getting-started) | [Setup as Test Environment](https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment) | [GitHub](https://github.com/capricorn86/happy-dom/)