# Serverless scripts env

## Introduction

This plugin aims to answer a specific need and to simplify the assignment of environment variables with serverless either front-end or back-end.

This plugin officially supports Node.js **6.10** and **8.10**.

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
