const omit = require('lodash.omit');
const pick = require('lodash.pick');
const { error } = require('./console');

const defaultCmd = ['offline', 'build'];

/**
 *
 * @param childConfig
 * @param name
 * @param serverlessEnv
 * @returns {{args: RemoteObject[] | string[] | *, logName: *, cmd: string, config: {cwd: string, env: *}} | *}
 */
const constructObjectScript = (childConfig, name, serverlessEnv) => {
  const {
    path, env, script, logName,
  } = childConfig;
  let absolutePath = process.cwd();

  if (!script || script === null) {
    error(`${name} as no property script defined`);
    return null;
  }
  if (!script.cmd) {
    error(`${name} as no property script defined with key cmd`);
    return null;
  }

  if (path !== null && path && /^\/|\w.*/.test(path)) {
    if (/^\//.test(path)) {
      absolutePath += path;
    } else if (/^\w/.test(path)) {
      absolutePath += `/${path}`;
    }
  } else if (!/^\/|\w.*/.test(path)) {
    error(`Received: ${path} ,you must provide an absolute path to command ${name} in serverless.yml, then default to current working directory`);
  }

  const blackList = env ? env.exclude || [] : [];

  return {
    name,
    logName: `[${name}] ${logName}`,
    cmd: script.cmd,
    args: script.args || [],
    config: {
      env: Object.assign(omit(serverlessEnv, blackList), process.env),
      cwd: absolutePath, // XXX default current working directory
    },
  };
};

/**
 *
 * @param config
 * @param serverlessEnv
 * @returns {*}
 */
const initValidObjectsScripts = (config, serverlessEnv) => {
  const validCmd = defaultCmd.filter((el) => Object.keys(config).includes(el));

  // keep all config properties that are equal to valid commands
  const validConfig = pick(config, validCmd);
  return Object.keys(validConfig).map((key) => constructObjectScript(validConfig[key], key, serverlessEnv)).filter((el) => el);
};

module.exports = {
  constructObjectScript,
  initValidObjectsScripts,
};
