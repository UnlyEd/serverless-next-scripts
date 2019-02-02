const Serverless = require('serverless');
const SeverlessScriptsEnv = require('./index');
const config = require('../test/__mocks__/serverlessMocks');

const serverless = (custom) => {
  const sls = new Serverless();
  sls.service.custom = custom;
  return sls;
};

global.console = {
  warn: jest.fn(),
  log: jest.fn(),
  error: console.error,
};


describe('@unly/serverless-scripts-env', () => {
  test('slsPlugin should warn about config, but not failed', () => {
    const slsPlugin = new SeverlessScriptsEnv(serverless({}));

    slsPlugin.validate();

    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('slsPlugin should failed if typeof config is not an object', () => {
    const slsPlugin = new SeverlessScriptsEnv(serverless({ slsScripts: 'hello' }));

    expect(slsPlugin.validate()).rejects.toEqual('Config slsScripts must be an object');
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  test('slsPlugin should have only one more property "offline" if other child config don\'t have a script or script.cmd property ', () => {
    const slsPlugin = new SeverlessScriptsEnv(serverless(config));
    const beforeOfflineInit = slsPlugin.hooks['before:offline:start'];

    beforeOfflineInit().then(() => {
      expect(slsPlugin.offline).toEqual(
        expect.objectContaining({
          name: 'offline',
          logName: '[offline] start',
          cmd: 'sls print',
          args: [],
          config:
              {
                env: Object.assign({}, process.env),
                cwd: process.cwd(),
              },
        })
      );
      expect(slsPlugin.start).toBeUndefined();
    });
  });

  test('slsPlugin should have only two properties "offline" and "build" even if there is one other in child config', () => {
    const nextConf = Object.assign({}, config);

    nextConf.slsScripts.build = {
      env: {
        exclude: ['SECRET_KEY'],
      },
      script: {
        args: [],
        cmd: 'start',
      },
      logName: 'compil',
      path: 'server',
    };

    const slsPlugin = new SeverlessScriptsEnv(serverless(nextConf));
    const beforeOfflineInit = slsPlugin.hooks['before:offline:start'];

    beforeOfflineInit().then(() => {
      expect(slsPlugin.offline).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          logName: expect.any(String),
          cmd: expect.any(String),
          args: expect.any(Array),
          config: expect.objectContaining({
            env: expect.any(Object),
            cwd: expect.any(String),
          }),
        })
      );
      expect(slsPlugin.build).toHaveProperty('cmd', 'start');
      expect(slsPlugin.start).toBeUndefined();
    });
  });

  test('should have create a new child process', () => {
    const slsPlugin = new SeverlessScriptsEnv(serverless(config));

    const beforeOfflineInit = slsPlugin.hooks['before:offline:start'];
    beforeOfflineInit().then(() => {
      expect(slsPlugin.process).toHaveProperty('spawnfile', 'sls print');
    });
  });


  test('should have exec a new command', () => {
    const slsPlugin = new SeverlessScriptsEnv(serverless(config));

    const beforePackageInit = slsPlugin.hooks['before:package:initialize'];

    beforePackageInit().then(() => {
      expect(slsPlugin.process).toBeUndefined();
      expect(console.log).toHaveBeenCalled();
    });
  });
});
