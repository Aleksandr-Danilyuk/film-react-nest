import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logSpy: jest.SpyInstance;
  const tskvLogger = new TskvLogger();

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  const parseTskv = (logged: string) =>
    logged
      .split('\t')
      .map((p) => p.trim())
      .filter(Boolean);

  it('warn: TSKV-запись с JSON-сообщением и параметром', () => {
    const payload = { a: 'b', c: 1 };
    tskvLogger.warn(payload, { extra: 'info' });

    expect(logSpy).toBeCalledTimes(1);

    const parts = parseTskv(logSpy.mock.calls[0][0]);
    expect(parts).toHaveLength(3); // level, message, optional

    const level = parts.find((p) => p.startsWith('level='))!.split('=')[1];
    const messageRaw = parts
      .find((p) => p.startsWith('message='))!
      .substring('message='.length);
    const optionalRaw = parts
      .find((p) => p.startsWith('optional='))!
      .substring('optional='.length);

    expect(level).toBe('warn');
    expect(JSON.parse(messageRaw)).toEqual({ a: 'b', c: 1 });
    expect(JSON.parse(optionalRaw)).toEqual([{ extra: 'info' }]);
  });

  it('error: простая строка без параметров — только level и message', () => {
    tskvLogger.error('Something went wrong');

    expect(logSpy).toBeCalledTimes(1);
    const parts = parseTskv(logSpy.mock.calls[0][0]);
    expect(parts).toHaveLength(2);

    const messageRaw = parts
      .find((p) => p.startsWith('message='))!
      .substring('message='.length);
    expect(JSON.parse(messageRaw)).toBe('Something went wrong');
  });

  it('log: несколько дополнительных параметров', () => {
    tskvLogger.log('start', 1, 'two', { three: 3 });

    const parts = parseTskv(logSpy.mock.calls[0][0]);
    const optionalRaw = parts
      .find((p) => p.startsWith('optional='))!
      .substring('optional='.length);
    expect(JSON.parse(optionalRaw)).toEqual([1, 'two', { three: 3 }]);
  });

  it('fatal: корректный уровень', () => {
    tskvLogger.fatal('critical');

    expect(logSpy).toBeCalledTimes(1);
    const parts = parseTskv(logSpy.mock.calls[0][0]);
    expect(parts.find((p) => p.startsWith('level='))).toBe('level=fatal');
  });

  it('debug и verbose: корректные уровни и одна запись на вызов', () => {
    tskvLogger.debug('d');
    tskvLogger.verbose('v');

    expect(logSpy.mock.calls).toHaveLength(2);
    expect(
      parseTskv(logSpy.mock.calls[0][0]).find((p) => p.startsWith('level=')),
    ).toBe('level=debug');
    expect(
      parseTskv(logSpy.mock.calls[1][0]).find((p) => p.startsWith('level=')),
    ).toBe('level=verbose');
  });

  it('табуляция и перевод строки в message не ломают TSKV-формат', () => {
    tskvLogger.log('line1\nline2\tend');

    const parts = parseTskv(logSpy.mock.calls[0][0]);
    // JSON.stringify экранирует \t и \n, поэтому запись не распадается
    expect(parts).toHaveLength(2);
    const messageRaw = parts
      .find((p) => p.startsWith('message='))!
      .substring('message='.length);
    expect(JSON.parse(messageRaw)).toBe('line1\nline2\tend');
  });
});
