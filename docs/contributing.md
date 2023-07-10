# Happy DOM Contributing Guide

We are very happy that you would like to contribute. In this guide you will find instructions on how to setup the repo locally and how to branch and create a pull request.

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

### Test

##### Run all Tests

```bash
npm test
```

##### Watch Tests

```bash
npm run test:watch
```

## Branch

Branch names currently have the pattern "task/{issueID}-name-of-branch". However, there is a plan to change this in the future and remove "task/".

## Commit Convention

The release process in Happy DOM is completely automated. In order to determine which version type a package should be released with and to be able to generate release notes, commits has to follow a certain format.

#### Format

\#{taskId}@{versionType}: {description}.

#### Version Types

| Type    | Description                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| trivial | Use this version type if the change doesn't affect the end user. The change will not be displayed in the release notes. |
| patch   | Bug fixes should use this version type.                                                                                 |
| minor   | New features that doesn't break anything for the end user should have this version type.                                |
| major   | Breaking changes should use this version type.                                                                          |

### Rebasing

The commit convention can cause problems when editing a message when rebasing. You can then set the setting "core.commentChar" to "auto" to workaround the problem.

We should consider moving over to Conventional Commit as it is more of a standard and doesn't have this problem.

# Pull Request

Do your changes on a branch. When you are done with your changes you can create a pull request.

Each pushed commit will trigger a Github Workflow that will compile, run tests, lint and check that the commit convention is followed. The Github Workflow has to comple successfully in order to merge the pull request.

One code owner has to approve the pull request. The code owner will usually merge the pull request if the build has passed and the code looks good.
