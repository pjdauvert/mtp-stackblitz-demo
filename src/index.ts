import server from './app';
import MongodbService, { type MongodbConfig } from './db/connector';

async function startServer() {
  const config: MongodbConfig = {
    mongodbHost: process.env.MONGODB_HOST,
    mongodbUser: process.env.MONGODB_USER,
    mongodbPwd: process.env.MONGODB_PWD,
    mongodbBase: process.env.MONGODB_BASE,
    mongodbAppName: process.env.MONGODB_APPNAME,
    mongodbSrv: true,
  };

  const db = new MongodbService(config);
  await db.establishConnection();

  const port = process.env.PORT || 3000;
  server
  .setTimeout(60000)
  .listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
