const log = require('../helpers/console');

describe('console', () => {
  global.console = {
    log: jest.fn(),
  };
  test('console.log should be called 4 times', () => {
    log.error('hello', 'Serverless-scripts');
    expect(console.log).toHaveBeenCalledTimes(1);

    log.process('next', 'Server');
    expect(console.log).toHaveBeenCalledTimes(2);

    log.processError('hello');
    expect(console.log).toHaveBeenCalledTimes(3);

    log.std('hello', 'Offline');
    expect(console.log).toHaveBeenCalledTimes(4);
  });

  test('should be called with and called one time', () => {
    const mockLog = {
      error: jest.fn(log.error),
      process: jest.fn(log.process),
      processError: jest.fn(log.processError),
      std: jest.fn(log.std),
    };

    mockLog.error('hello', 'Serverless-scripts');
    expect(mockLog.error).toHaveBeenCalledWith('hello', 'Serverless-scripts');
    expect(mockLog.error).toHaveBeenCalledTimes(1);

    mockLog.process('next', 'Server');
    expect(mockLog.process).toHaveBeenCalledWith('next', 'Server');
    expect(mockLog.process).toHaveBeenCalledTimes(1);

    mockLog.processError('hello');
    expect(mockLog.processError).toHaveBeenCalledWith('hello');
    expect(mockLog.processError).toHaveBeenCalledTimes(1);

    mockLog.std('hello', 'Offline', 'white');
    expect(mockLog.std).toHaveBeenCalledWith('hello', 'Offline', 'white');
    expect(mockLog.std).toHaveBeenCalledTimes(1);
  });
});
