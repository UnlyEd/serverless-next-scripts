[![Build Status](https://travis-ci.com/UnlyEd/serverless-scripts-env.svg?branch=master)](https://travis-ci.com/UnlyEd/serverless-scripts-env)

# Serverless Scripts Env

## Introduction

This plugin aims to answer a specific need and to simplify the assignment of environment variables with serverless either front-end or back-end.

This plugin officially supports Node.js **6.10** and **8.10**.

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Step 1: Load the Plugin](#step-1-load-the-plugin)
  * [Step 2: Configure your `serverless.yml`](#step-2-configure-your-serverlessyml)
- [Configuration of `slsScripts` object:](#configuration-of-slsscripts-object)
    + [`offline` & `build` object:](#offline--build-object)
  * [Try it out yourself](#try-it-out-yourself)
- [API](#api)
- [Contributing](#contributing)
  * [Getting started](#getting-started)
  * [Test](#test)
  * [Releasing and publishing](#releasing-and-publishing)
- [License](#license)

<!-- tocstop -->

## Installation

Install the plugin using either Yarn or NPM. (we use Yarn)

NPM:
```bash
npm install @unly/serverless-scripts-env
```

YARN:
```bash
yarn add @unly/serverless-scripts-env
```

## Usage

### Step 1: Load the Plugin

The plugin determines your environment during deployment and adds all environment variables to your Lambda function.
All you need to do is to load the plugin:

> Must be declared **before** `serverless-webpack`, despite what their officially doc says

```yaml
plugins:
  - '@unly/serverless-scripts-env' # Must be first, even before "serverless-webpack", see https://github.com/UnlyEd/serverless-scripts-env
  - serverless-webpack # Must be second, see https://github.com/99xt/serverless-dynamodb-local#using-with-serverless-offline-and-serverless-webpack-plugin
```

### Step 2: Configure your `serverless.yml`

Set the `slsScripts` object configuration as follows (list of all available options below):

```yaml
custom:
  slsScripts:
    offline:
      logName: client # name of the command that appears in the terminal being executed
      script:
        cmd: next # command to execute
        args:
          - -p 3001
      path: # Absolute path to run the command by default take root folder
      env:
        exclude: # list of environment variables present that will not be provided at launch time in the child process
          - SECRET_KEY

provider:
  name: aws
  runtime: nodejs6.10
  environment:
    GROUP_NAME: staging
    SECRET_KEY: f08ed2dc-edeb-45f4-9cac-56012820a384
```

## Configuration of `slsScripts` object:

| Attributes |  Type  | Required | Description                                                      |
|------------|:------:|:--------:|------------------------------------------------------------------|
| offline    | Object |   false  | script to run before cli serverless-offline start                |
| build      | Object |   false  | script to run before cli serverless deploy or serverless package |

#### `offline` & `build` object:

| Attributes |  Type  | Required | Default                   | Description                                                     |
|------------|:------:|----------|---------------------------|-----------------------------------------------------------------|
| logName    | String |   false  | Serverless-scripts-env    | name of the command that appears in the terminal being executed |
| script     | Object |   true   |                           |                                                                 |
| path       | String |   false  | current working directory | Absolute Path to run the script                                 |
| env        | Object |   false  |                           |                                                                 |

##### `script` object :

| Attributes |  Type  | Required | Default | Description                  |
|------------|:------:|----------|:-------:|------------------------------|
| cmd        | String |   true   |         | command to execute           |
| args       |  Array of String |   false  |   [ ]   | command arguments to execute |

##### `env` object :

| Attributes |       Type      | Required | Default | Description                        |
|------------|:---------------:|----------|---------|------------------------------------|
| exclude    | Array of String |   false  |         | environment variables to blacklist |


### Try it out yourself

To test this plugin, you can clone this repository.
Go to `examples/`, and follow the README.

---

## API

[API](./API.md)

---

## Contributing

We gladly accept PRs, but please open an issue first so we can discuss it beforehand.

### Getting started

```
yarn start # Shortcut - Runs linter + tests in concurrent mode (watch mode)

OR run each process separately for finer control

yarn lint
yarn test
```

### Test

```
yarn test # Run all tests, interactive and watch mode
yarn test:once
yarn test:coverage
```

### Releasing and publishing

```
yarn releaseAndPublish # Shortcut - Will prompt for bump version, commit, create git tag, push commit/tag and publish to NPM

yarn release # Will prompt for bump version, commit, create git tag, push commit/tag
npm publish # Will publish to NPM
```

## License

MIT
