// backend/src/logger/tskv.logger.ts
import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private serialize(value: unknown): string {
    try {
      return JSON.stringify(value ?? '');
    } catch {
      return JSON.stringify(String(value));
    }
  }

  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const optional = optionalParams.length
      ? `optional=${this.serialize(optionalParams)}`
      : '';

    return [`level=${level}`, `message=${this.serialize(message)}`, optional]
      .filter(Boolean)
      .join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('fatal', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
