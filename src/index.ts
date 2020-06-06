import './database/connection';
import app from './server/app';

const port: number = app.get('port');

app.listen(port, () => {
  console.log(`Now running on http://localhost:${port}`);
});
