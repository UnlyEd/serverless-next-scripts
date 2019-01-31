const omit = require('lodash.omit');

const { initValidObjectsScripts, constructObjectScript } = require('../helpers/checkValidScript');

const config = {
  offline: {
    env: {
      exclude: [],
    },
    logName: 'start',
    path: '/server',
  },
};

const env = {
  ENV: 'test',
};

global.console = {
  log: jest.fn(),
  warn: jest.fn(),
};

describe('constructObjectScript', () => {
  test('must return null and warning', () => {
    const script = constructObjectScript(config.offline, 'offline', { ENV: 'test' });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(script).toEqual(null);
  });


  test('should return a script object with keys { name, logName, cmd, args, config}', () => {
    config.offline.script = {
      cmd: 'sls print',
      args: [],
    };
    const script = constructObjectScript(config.offline, 'offline', { ENV: 'test' });
    expect(script).toHaveProperty('name');
    expect(script).toHaveProperty('logName');
    expect(script).toHaveProperty('cmd');
    expect(script).toHaveProperty('args');
    expect(script).toHaveProperty('config');
  });

  test('should warning if path is not absolute, then defined it to default current working directory', () => {
    config.offline.path = './';
    const script = constructObjectScript(config.offline, 'offline', { ENV: 'test' });
    expect(script).toEqual(
      expect.objectContaining(
        {
          name: 'offline',
          logName: '[offline] start',
          cmd: 'sls print',
          args: [],
          config: {
            cwd: process.cwd(),
            env: Object.assign({}, env, process.env),
          },
        }
      )
    );
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});

const nextEnv = Object.assign({}, env, {
  SECRET_KEY: 'ABC10',
});

const nextConfig = Object.assign({}, config, {
  start: {
    env: {
      exclude: [],
    },
    logName: 'start',
    path: '/server',
  },
  build: {
    env: {
      exclude: ['SECRET_KEY'],
    },
    logName: 'compil',
    path: 'server',
  },
});

describe('initValidObjectsScripts', () => {
  test('should return one script object', () => {
    const script = initValidObjectsScripts(nextConfig, nextEnv);
    expect(script.length).toEqual(1);
    expect(script).toEqual(
      expect.arrayContaining([
        {
          name: 'offline',
          logName: '[offline] start',
          cmd: 'sls print',
          args: [],
          config:
              {
                env: Object.assign({}, nextEnv, process.env),
                cwd: process.cwd(),
              },
        },
      ])
    );
    expect(console.log).toHaveBeenCalledTimes(4);
  });

  test('should return two scripts object', () => {
    nextConfig.build.script = {
      cmd: 'sls print',
      args: ['--out', 'json'],
    };
    const scripts = initValidObjectsScripts(nextConfig, nextEnv);
    expect(scripts.length).toEqual(2);
  });

  test('should not provided SECRET_KEY to config.env in build script', () => {
    const scripts = initValidObjectsScripts(nextConfig, nextEnv);
    expect(scripts).toEqual(
      expect.arrayContaining([
        {
          name: 'offline',
          logName: '[offline] start',
          cmd: 'sls print',
          args: [],
          config:
              {
                env: Object.assign({}, nextEnv, process.env),
                cwd: process.cwd(),
              },
        },
        {
          name: 'build',
          logName: '[build] compil',
          cmd: 'sls print',
          args: ['--out', 'json'],
          config:
              {
                env: omit(Object.assign({}, nextEnv, process.env), ['SECRET_KEY']),
                cwd: `${process.cwd()}/server`,
              },
        },
      ])
    );
    expect(scripts[0].config.env.SECRET_KEY).toEqual('ABC10');
    expect(scripts[1].config.env.SECRET_KEY).toEqual(undefined);
  });
});
