import { NODE_ENV } from './config/env.js';

import express from 'express';
import rateLimit from 'express-rate-limit';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import authRoute from './routes/authRoute.js';
import AppError from './utils/AppError.js';
import mediaRoute from './routes/mediaRoute.js';

export const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Rate limit exceeded. Please try again in a few minutes.',
});

// Source - https://stackoverflow.com/q/79787302
// Posted by Ahmed Gamal, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-02, License - CC BY-SA 4.0

app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(limiter);
app.use(ExpressMongoSanitize());

const xssOptions = {
  whiteList: {},
  escapeHtml: (str) => str,
  stripIgnoreTag: true,
};

app.use((req, res, next) => {
  if (req.body) {
    const clean = (obj) => {
      if (typeof obj === 'string') return xss(obj, xssOptions);
      if (Array.isArray(obj)) return obj.map(clean);
      if (obj && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, clean(v)]),
        );
      }
      return obj;
    };
    req.body = clean(req.body);
  }
  next();
});

app.use('/api/auth', authRoute);
app.use('/api/media', mediaRoute);

app.all(/(.*)/, (req, res, next) => {
  return next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
