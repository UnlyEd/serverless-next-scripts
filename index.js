'use strict';

const BbPromise = require('bluebird');
const { spawn, exec } = require('child_process');

const { initValidObjectsScripts } = require('./helpers/checkValidScript');
const log = require('./helpers/console');

class ServerlessNextEnv {
  constructor(serverless) {

    this.env = serverless.service.provider.environment;
    this.custom = serverless.service.custom;

    this.config = this.custom['slsScripts'];
    console.log(this)

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
   * slsScripts validation in custom serverless
   * @returns {*}
   */
  validate() {
    console.log('jsdkljdkljsdjsjd')
    if(!this.config) {
      log.std('There is no configuration set in serverless.yml');
      return BbPromise.resolve();
    }
    if(typeof this.config !== 'object'){
      return BbPromise.reject(log.error(`Config slsScripts must be an object, but received ${typeof this.config}`));
    }
    console.log(1)
    return BbPromise.resolve();
  }

  /**
   *
   * @returns {Promise<any>}
   */
  exec() {
    return new Promise((resolve, reject) => {
      if (!this.offline) {
        log.std('slsScripts build should be defined in serverless');
        return resolve();
      }
      return exec(
        this.build.cmd,
        `${this.build.config} ${this.build.args}`,
        (error, stdout) => {
          if (error) {
            log.processError(`exec error: ${error}`);
            return reject();
          }
          log.process(stdout);
          return resolve();
        });
    });
  }

  /**
   * Set this with each valid cmd script
   * @returns {*}
   */
  init() {

    const scripts = initValidObjectsScripts(this.config, this.env);

    scripts.map(script => {
      this[script.cmdName] = script;
    });
    console.log(2)

    return BbPromise.resolve();
  }

  /**
   * Run a new child process, listen on error, and log all console(log and error) of this process
   * @returns {Promise<any>}
   */
  command() {
    return new Promise(resolve => {

      if (!this.offline) {
        log.std('slsScripts local should be defined in serverless');
        return resolve();
      }

      this.process = spawn(
        this.offline.cmd,
        this.offline.args,
        this.offline.config
        );

      this.process.on('error', (err) => {
        log.processError(err.toString('utf8'));
      });

      this.process.stdout.on('data', (data) => {
        log.process(data.toString('utf8'));
      });

      this.process.stderr.on('data', (data) => {
        log.processError(data.toString('utf8'));
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
      log.process(`cmd: ${this.offline.name} ${this.args.join(' ')}, stop process ${this.process.pid}`);
    });

    return BbPromise.resolve();
  }

}

module.exports = ServerlessNextEnv;
