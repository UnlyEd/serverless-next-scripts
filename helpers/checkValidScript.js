const _omit = require('lodash.omit');
const _pick = require('lodash.pick');
const { error } = require('./console');

const defaultCmd = ['offline', 'build'];

/**
 *
 * @param config
 * @param env
 * @returns {*}
 */
const initValidObjectsScripts = (config, env) => {
  const validCmd = defaultCmd.filter(el => Object.keys(config).includes(el));

  // keep all config properties that are equal to valid commands
  const validConfig = _pick(config, validCmd);
  return ObjectKeys(validConfig).map(childConfig => constructObjectScript(validConfig[childConfig], childConfig, env));
};

/**
 *
 * @param childConfig
 * @param name
 * @param env
 * @returns {{args: RemoteObject[] | string[] | *, logName: *, cmd: string, config: {cwd: string, env: *}}}
 */
const constructObjectScript = (childConfig, name, env) => {
  if (!childConfig.script) {
    error(`${name} as no property script set`);
    return;
  }

  return {
    cmdName: name,
    logName: childConfig.logName,
    cmd: childConfig.script.cmd,
    args: childConfig.script.args,
    config: {
      env: Object.assign(process.env, _omit(env, childConfig.blackList || [])),
      cwd: process.cwd(), // XXX default
    },
  };
};

module.exports = {
  constructObjectScript,
  initValidObjectsScripts,
};
