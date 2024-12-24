import express from 'express';
import { createServer } from 'http';
import statusCode from 'http-status-codes';
import httpLogger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes/routes';
import { renderHtmlError } from './public/errorHandler';

dotenv.config();

const app = express();

app.use(httpLogger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

// API routes
app.use('/api', routes);
// capture all remaining calls to API and block them with a 404
app.use('/api', (req, res, next) => {
  if (req.originalUrl?.startsWith('/api'))
    res.status(statusCode.NOT_FOUND).end();
  else next();
});

// index file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error logger
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    if (!res.headersSent) {
      res.status(statusCode.INTERNAL_SERVER_ERROR);
      // render error depending on requested content-type
      if (req.accepts('json')) {
        res.set('Content-Type', 'application/json').json(err);
      } else {
        res.set('Content-Type', 'text/html').send(renderHtmlError(err));
      }
    }
  }
);

export default createServer(app);
