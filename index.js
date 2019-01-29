'use strict';

const BbPromise = require('bluebird');
const { spawn, exec } = require('child_process');

const { initValidObjectsScripts } = require('./helpers/checkValidScript');
const log = require('./helpers/console');

class ServerlessNextEnv {
  constructor(serverless) {
    this.env = serverless.service.provider.environment;
    this.custom = serverless.service.custom;

    this.config = this.custom.slsScripts;

    this.hooks = {
      'before:package:initialize': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.init)
        .then(this.exec),
      'before:offline:start': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.init)
        .then(this.command)
        .then(this.listenToSigInt),
    };
  }

  /**
   * slsScripts validation in custom serverless
   * @returns {*}
   */
  validate() {
    if (!this.config) {
      log.std('There is no configuration set in serverless.yml');
      return BbPromise.resolve();
    }
    if (typeof this.config !== 'object') {
      log.error(`Config slsScripts must be an object, but received ${typeof this.config}`);
      return BbPromise.reject('Config slsScripts must be an object');
    }
    return BbPromise.resolve();
  }

  /**
   * Execute a process with build arguments
   * @returns {Promise<any>}
   */
  exec() {
    const cmd = `${this.build.cmd} ${this.build.args.join(' ')}`;
    return new Promise((resolve, reject) => {
      if (!this.build) {
        log.std('slsScripts build should be defined in serverless');
        return resolve();
      }
      log.std(cmd);
      return exec(
        cmd,
        this.build.config,
        (error, stdout) => {
          if (error) {
            log.processError(`exec error: ${error}`, this.build.logName);
            return reject();
          }
          log.process(stdout, this.build.logName);
          return resolve();
        }
      );
    });
  }

  /**
   * Set this with each valid cmd script
   * @returns {*}
   */
  init() {
    const scripts = initValidObjectsScripts(this.config, this.env);

    scripts.forEach((script) => {
      this[script.name] = script;
    });
    return BbPromise.resolve();
  }

  /**
   * Run a new child process, listen on error, and log all console(log and error) with offline arguments
   * @returns {Promise<any>}
   */
  command() {
    return new Promise((resolve) => {
      if (!this.offline) {
        log.std('slsScripts local should be defined in serverless');
        return resolve();
      }

      this.process = spawn(this.offline.cmd, this.offline.args, this.offline.config);

      this.process.on('error', (err) => {
        log.processError(err.toString('utf8'), this.offline.logName);
      });

      this.process.stdout.on('data', (data) => {
        log.process(data.toString('utf8'), this.offline.logName);
      });

      this.process.stderr.on('data', (data) => {
        log.processError(data.toString('utf8'), this.offline.logName);
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
      const { name, cmd, args } = this.offline;
      log.std(`Got SIGINT signal. Halting ${name} with ${cmd} ${args.join(' ')}${this.process.pid ? `, process ${this.process.pid}` : ''}`);
    });

    return BbPromise.resolve();
  }
}

module.exports = ServerlessNextEnv;
