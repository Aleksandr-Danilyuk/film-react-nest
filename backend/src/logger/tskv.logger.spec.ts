// backend/src/logger/tskv.logger.spec.ts
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

  it('should log correct TSKV format with JSON message and optional params', () => {
    const payload = { a: 'b', c: 1 };
    tskvLogger.warn(payload, { extra: 'info' });

    expect(logSpy).toBeCalledTimes(1);

    const logged = logSpy.mock.calls[0][0];
    expect(logged).toContain('level=warn');

    const parts = logged.split('\t').map(p => p.trim()).filter(Boolean);
    expect(parts).toHaveLength(3); // level, message, optional

    const levelPart = parts.find(p => p.startsWith('level='))!;
    const messagePart = parts.find(p => p.startsWith('message='))!;
    const optionalPart = parts.find(p => p.startsWith('optional='))!;

    const level = levelPart.split('=')[1];
    const messageRaw = messagePart.substring('message='.length);
    const optionalRaw = optionalPart.substring('optional='.length);

    expect(level).toBe('warn');

    const message = JSON.parse(messageRaw);
    expect(message).toEqual({ a: 'b', c: 1 });

    const optionalParams = JSON.parse(optionalRaw);
    expect(optionalParams).toEqual([{ extra: 'info' }]);
  });

  it('should handle plain string message correctly', () => {
    tskvLogger.error('Something went wrong');

    expect(logSpy).toBeCalledTimes(1);
    const logged = logSpy.mock.calls[0][0];
    const parts = logged.split('\t').map(p => p.trim()).filter(Boolean);

    expect(parts).toHaveLength(2); // level, message (без optional)

    const messagePart = parts.find(p => p.startsWith('message='))!;
    const messageRaw = messagePart.substring('message='.length);

    // Строка остаётся строкой, JSON.stringify даёт "\"Something went wrong\""
    expect(JSON.parse(messageRaw)).toBe('Something went wrong');
  });
});
