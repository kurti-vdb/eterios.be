import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  apiUrl: '',
  logLevel: NgxLoggerLevel.ERROR,
  appVersion: require('../../package.json').version,
};
