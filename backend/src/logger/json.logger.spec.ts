import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logSpy: jest.SpyInstance;
  const jsonLogger = new JsonLogger();

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  const lastLogged = (spy: jest.SpyInstance) =>
    JSON.parse(spy.mock.calls.at(-1)![0]);

  it('warn: пишет одну JSON-запись с параметрами', () => {
    jsonLogger.warn('hello', { a: 'b', c: 1 });

    expect(logSpy).toBeCalledTimes(1);
    expect(lastLogged(logSpy)).toEqual({
      level: 'warn',
      message: 'hello',
      optionalParams: [{ a: 'b', c: 1 }],
    });
  });

  it('log: сообщение без дополнительных параметров', () => {
    jsonLogger.log('plain message');

    expect(logSpy).toBeCalledTimes(1);
    expect(lastLogged(logSpy)).toEqual({
      level: 'log',
      message: 'plain message',
      optionalParams: [],
    });
  });

  it('fatal: несколько дополнительных параметров разных типов', () => {
    jsonLogger.fatal('ctx', 42, { deep: [1, 2] }, true);

    expect(logSpy).toBeCalledTimes(1);
    expect(lastLogged(logSpy)).toEqual({
      level: 'fatal',
      message: 'ctx',
      optionalParams: [42, { deep: [1, 2] }, true],
    });
  });

  it('error: уровень и структура JSON', () => {
    jsonLogger.error('boom', { code: 500 });

    expect(logSpy).toBeCalledTimes(1);
    expect(lastLogged(logSpy)).toEqual({
      level: 'error',
      message: 'boom',
      optionalParams: [{ code: 500 }],
    });
  });

  it('debug и verbose: пишут с корректным уровнем', () => {
    jsonLogger.debug('dbg');
    jsonLogger.verbose('vrb');

    expect(logSpy).toBeCalledTimes(2);
    expect(JSON.parse(logSpy.mock.calls[0][0]).level).toBe('debug');
    expect(JSON.parse(logSpy.mock.calls[1][0]).level).toBe('verbose');
  });

  it('сохраняет табуляцию и перевод строки внутри message', () => {
    jsonLogger.log('line1\nline2\tend');

    expect(lastLogged(logSpy).message).toBe('line1\nline2\tend');
  });

  it('каждый вызов — ровно одна запись', () => {
    jsonLogger.log('a');
    jsonLogger.warn('b');
    jsonLogger.debug('c');

    expect(logSpy.mock.calls).toHaveLength(3);
  });
});
