module.exports = {
  slsScripts: {
    offline: {
      env: {
        exclude: [],
      },
      logName: 'start',
      path: '/server',
      script: {
        cmd: 'sls print', args: [],
      },
    },
  },
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
    script: {
      args: [],
    },
    logName: 'compil',
    path: 'server',
  },
};
