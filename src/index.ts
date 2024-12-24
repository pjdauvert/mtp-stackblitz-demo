import server from './app';
import MongodbService, { type MongodbConfig } from './db/connector';

async function startServer() {
  const config: MongodbConfig = {
    mongodbHost: process.env.MONGODB_HOST,
    mongodbUser: process.env.MONGODB_USER,
    mongodbPwd: process.env.MONGODB_PWD,
    mongodbBase: process.env.MONGODB_BASE,
    mongodbSrv: true,
  };

  console.log(JSON.stringify(process.env, null, 2));
  console.log(process.env.TEST_SECRET_KEY);

  const db = new MongodbService(config);
  await db.establishConnection().catch(() => process.exit(1));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer().catch(console.error);
