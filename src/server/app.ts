import express from 'express';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';

import indexRouter from '../routes/index';
import packageRouter from '../routes/package';
import packageManagerRouter from '../routes/packageManager';

const app: express.Application = express();

app
  .set('port', process.env.PORT || 3000)
  .set('public', path.join(__dirname, '../public'))
  .use(logger('dev'))
  .use(cors())
  .use(express.json())
  .use('/', indexRouter)
  .use('/package', packageRouter)
  .use('/package-manager', packageManagerRouter)
  .use('/public', express.static(app.get('public')));

export default app;
