import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private sanitizeJsonString(jsonStr: string): string {
    return jsonStr.replace(/[\t\n\r]/g, ' ');
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const messageJson = typeof message === 'string' ? message : JSON.stringify(message);
    const sanitizedMessage = this.sanitizeJsonString(messageJson);

    const optional = optionalParams.length
      ? `optional=${this.sanitizeJsonString(JSON.stringify(optionalParams))}`
      : '';

    const parts = [
      `level=${level}`,
      `message=${sanitizedMessage}`,
    ];

    if (optional) {
      parts.push(optional);
    }

    return parts.join('\t');
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
