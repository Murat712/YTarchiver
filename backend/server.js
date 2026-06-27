import express from 'express';
import rateLimit from 'express-rate-limit';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss';
import connectDB from './config/db.js';
import { port, NODE_ENV } from './config/env.js';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Rate limit exceeded. Please try again in a few minutes.',
});

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(limiter);
app.use(ExpressMongoSanitize());
app.use(express.json());

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

app.all(/(.*)/, (req, res) => {
    res.send(`Cannot find ${req.originalUrl}`);
});

try {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} catch {
    process.exit(1);
}
