import server from './app';
import MongodbService, { type MongodbConfig } from './db/connector';
import debug from 'debug';

const debugLog = debug('mtpdemo:index');
async function startServer() {
  debugLog('Starting server');
  debugLog(JSON.stringify(process.env, null, 2));
  const config: MongodbConfig = {
    mongodbHost: process.env.MONGODB_HOST,
    mongodbUser: process.env.MONGODB_USER,
    mongodbPwd: process.env.MONGODB_PWD,
    mongodbBase: process.env.MONGODB_BASE,
    mongodbSrv: true,
  };

  const db = new MongodbService(config);
  await db.establishConnection().catch(() => process.exit(1));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
