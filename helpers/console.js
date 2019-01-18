const chalk = require('chalk');

const serviceName = 'Serverless-scripts-env';

const logService = (color = 'blue', name) => {
  return chalk[color].bold(`${name}: `);
};

/**
 * Red error Log for child process
 * @param name
 * @param color
 * @param str
 */
const processError = (str, name = serviceName, color = 'red') => {
  console.log(logService(color, name), chalk[color](str));
};

/**
 * Blue log for child process
 * @param name
 * @param color
 * @param str
 */
const process = (str, name = serviceName, color = 'blue') => {
  console.log(logService(color, name), chalk[color](str));
};

/**
 * Yellow Log plugin
 * @param name
 * @param color
 * @param str
 */
const std = (str, name = serviceName, color = 'yellow') => {
  console.log(logService(color, name), chalk[color](str));
};

/**
 * Red error Log plugin
 * @param name
 * @param color
 * @param str
 */
const error = (str, name = serviceName, color = 'red') => {
  console.log(logService(color, name), chalk[color](str));
};

module.exports = {
  std,
  error,
  process,
  processError,
};
