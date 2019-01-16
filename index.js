'use strict';

const BbPromise = require('bluebird');
const chalk = require('chalk');
const { spawn, exec } = require('child_process');

class ServerlessNextEnv {
  constructor(serverless) {

    this.env = serverless.service.provider.environment;
    this.custom = serverless.service.custom;

    this.hooks = {
      'before:package:initialize': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.init)
        .then(this.exec),
      'before:offline:start:init': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.init)
        .then(this.command)
        .then(this.listenToSigInt),
    };
  }

  /**
   *
   * @returns {Promise<any>}
   */
  exec() {
    return new Promise((resolve, reject) => {
      if (!this.invokeBuildCmd) {
        ServerlessNextEnv.log('nextScripts.build should be define in serverless');
        return resolve();
      }
      return exec(
        this.invokeBuildCmd,
        {
          cwd: process.cwd(),
          env: Object.assign(process.env, this.env),
        },
        (error, stdout) => {
          if (error) {
            ServerlessNextEnv.stderrLog(`exec error: ${error}`);
            return reject();
          }
          ServerlessNextEnv.stdoutLog(stdout);
          return resolve();
        });
    });
  }

  /**
   * nextScripts validation in custom serverless
   * @returns {*}
   */
  validate() {
    if (!this.custom.hasOwnProperty('nextScripts') && typeof this.custom['next-build'] !== 'object') {
      ServerlessNextEnv.log('nextScripts in serverless.yml is not properly set');
      return BbPromise.reject();
    }
    return BbPromise.resolve();
  }

  /**
   * Set this with cmd in custom
   * @returns {*}
   */
  init() {

    if (this.custom['nextScripts'].build && typeof this.custom['nextScripts'].build === 'string') {
      this.invokeBuildCmd = this.custom['nextScripts'].build;
    }

    if (this.custom['nextScripts'].local && typeof this.custom['nextScripts'].local === 'string') {
      const localCmd = this.custom['nextScripts'].local;
      const args = localCmd.split(' ');

      this.invokeLocalCmd = args[0];
      this.args = args.slice(1, args.length);
    }

    return BbPromise.resolve();
  }

  /**
   * Run a new child process, listen on error, and log all console(log and error) of this process
   * @returns {Promise<any>}
   */
  command() {
    return new Promise(resolve => {

      if (!this.invokeLocalCmd) {
        ServerlessNextEnv.log('nextScripts.local should be define in serverless');
        return resolve();
      }

      this.process = spawn(
        this.invokeLocalCmd,
        this.args,
        {
          cwd: process.cwd(),
          env: Object.assign(process.env, this.env),
        });

      this.process.on('error', (err) => {
        ServerlessNextEnv.stderrLog(err.toString('utf8'));
      });

      this.process.stdout.on('data', (data) => {
        ServerlessNextEnv.stdoutLog(data.toString('utf8'));
      });

      this.process.stderr.on('data', (data) => {
        ServerlessNextEnv.stderrLog(data.toString('utf8'));
      });

      return resolve();
    });
  }

  /**
   * Listen for ctrl+c to stop the server
   * @returns {*}
   */
  listenToSigInt() {
    process.on('SIGINT', () => {
      ServerlessNextEnv.stdoutLog(`cmd: ${this.invokeLocalCmd} ${this.args.join(' ')}, stop process ${this.process.pid}`);
    });

    return BbPromise.resolve();
  }

  /**
   * Red Log console.error for child process
   * @param str
   */
  static stderrLog(str) {
    console.log(chalk.bgRed.white.bold('client:'), chalk.red(str));
  }

  /**
   * Blue log console.log for child process
   * @param str
   */
  static stdoutLog(str) {
    console.log(chalk.bgBlue.black.bold('client:'), chalk.blue(str));
  }

  /**
   * Yellow Log plugin console.log
   * @param str
   */
  static log(str) {
    console.log(chalk.bgYellow.white.bold('Serverless-next-env: '), chalk.yellow.bold(str));
  }

}

module.exports = ServerlessNextEnv;
