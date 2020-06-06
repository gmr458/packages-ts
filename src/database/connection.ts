import { connect, connection, Connection, ConnectionOptions } from 'mongoose';
const connectionOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

connect('mongodb://localhost/packages', connectionOptions);

const conn: Connection = connection;

conn
  .once('open', (): void =>
    console.log('The connection to the database was established')
  )
  .on('error', (error): void => {
    console.log(error);
    process.exit(0);
  });
