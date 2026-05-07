import { Application } from 'express';
import { dateFormat } from './date.helper';
import { currencyFormat } from './currency.helper';

const helpers: Record<string, unknown> = {
  dateFormat,
  currencyFormat,
};

export const registerHelpers = (app: Application): void => {
  Object.assign(app.locals, helpers);
};
