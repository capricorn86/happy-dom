# Contributing Guide

We are very happy that you would like to contribute. In this guide you will find instructions on how to setup the repo locally.

## Setup

### Install

We need to add "--legacy-peer-deps" to the install as a workaround to be able to install Vitest. Otherwise we get an "Cannot set properties of null (setting 'parent')" error as Vitest has "happy-dom" as peer dependency. Hopefully we can find a better solution in the future.

```bash
npm install --legacy-peer-deps
```

### Compile

```bash
npm run compile
```

### Watch

```bash
npm run watch
```

### Debugging

1. Go to the package you wish to test in the terminal (e.g. "cd ./packages/happy-dom")
2. Write "debugger;" at the place you want to place a breakpoint in the code.
3. Run the following command in the terminal:

```bash
npm run test:debug
```

4. Open Chrome.
5. Open developer tools.
6. A green ball should appear to the left of the menu bar in developer tools.
7. Click on the green ball.
8. Click continue to jump to your breakpoint.

### Automated Tests

**Run tests**

```bash
npm test
```

**Watch tests**

```bash
npm run test:watch
```

# Commit Convention

We use the [Conventional Commits](https://www.conventionalcommits.org/en/) standard for our commit messages. The description should start with an uppercase character.

**Example**

```
fix: [#123] This is my commit message
```

# Pull Request

Do your changes on a branch. When you are done with your changes you can create a pull request.

Each pushed commit will trigger a Github Workflow that will compile, run tests, lint and check that the commit convention is followed. The Github Workflow has to complete successfully in order to merge the pull request.

One code owner has to approve the pull request. The code owner will usually merge the pull request if the build has passed and the code looks good.
