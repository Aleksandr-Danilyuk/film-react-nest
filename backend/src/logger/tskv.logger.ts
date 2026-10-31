// backend/src/logger/tskv.logger.ts
import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private serialize(value: any): string {
    try {
      return JSON.stringify(value ?? '');
    } catch {
      return JSON.stringify(String(value));
    }
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const optional = optionalParams.length
      ? `optional=${this.serialize(optionalParams)}`
      : '';

    return [`level=${level}`, `message=${this.serialize(message)}`, optional]
      .filter(Boolean)
      .join('\t');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('fatal', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
