const chalk = require('chalk');

const logName = 'Serverless-scripts-env';
/**
 * Red error Log for child process
 * @param name
 * @param str
 */
const processError = (str, name = logName) => {
  console.log(chalk.bgRed.white.bold(`${name}: `), chalk.red(str));
};

/**
 * Blue log for child process
 * @param name
 * @param str
 */
const process = (str, name = logName) => {
  console.log(chalk.bgBlue.black.bold(`${name}: `), chalk.blue(str));
};

/**
 *
 * Yellow Log plugin
 * @param name
 * @param str
 */
const std = (str, name = logName) => {
  console.log(chalk.bgYellow.black.bold(`${name}: `), chalk.yellow.bold(str));
};

/**
 * Red error Log plugin
 * @param name
 * @param str
 */
const error = (str, name = logName) => {
  console.log(chalk.bgRed.white.bold(`${name}: `), chalk.yellow.bold(str));
};

module.exports = {
  std,
  error,
  process,
  processError,
};
