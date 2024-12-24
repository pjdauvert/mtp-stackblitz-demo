import mongoose from 'mongoose';
import uriFormat from 'mongodb-uri';

export type MongodbConfig = {
  mongodbHost: string;
  mongodbBase: string;
  mongodbAppName: string;
  mongodbUser?: string;
  mongodbPwd?: string;
  mongodbPort?: string;
  mongodbSrv?: boolean;
};

class MongoDBService {
  private readonly config: MongodbConfig;

  constructor(config: MongodbConfig) {
    this.config = config;
  }

  /**
   * Consumes configuration object to build the MongoDB URI.
   * When in production, the URI is built for accessing the replica set using the DNS SRV record.
   * When in development, the URI is built for accessing the primary node of the replica set.
   *
   * @returns {string} encodedMongoURI - the encoded MongoDB URI
   *
   * @private
   */
  private getEncodedMongoURI(): string {
    const mongodbAccount = this.config.mongodbUser
      ? `${this.config.mongodbUser}:${this.config.mongodbPwd}@`
      : '';
    const protocol = this.config.mongodbSrv ? 'mongodb+srv' : 'mongodb';
    const port = !this.config.mongodbSrv ? `:${this.config.mongodbPort}` : '';
    let params = this.config.mongodbSrv ? `?retryWrites=true&w=majority` : '';
    if(this.config.mongodbAppName) params += `&appName=${this.config.mongodbAppName}`

    let uri = `${protocol}://${mongodbAccount}${this.config.mongodbHost}${port}${params}`;
    const parsed = uriFormat.parse(uri);
    uri = uriFormat.format(parsed);
    //console.log(`MongoDB URI: ${uri}`);
    return uri;
  }

  /**
   * Given no parameters, it attaches listeners to the MongoDB connection, in order to have better monitoring.
   * The following events are listened to:
   * - connecting: Emitted when Mongoose starts making its initial connection to the MongoDB server
   * - connected: Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when Mongoose reconnects after losing connectivity. May be emitted multiple times if Mongoose loses connectivity.
   * - open: Emitted after 'connected' and onOpen is executed on all of this connection's models.
   * - disconnecting: Your app called Connection#close() to disconnect from MongoDB
   * - disconnected: Emitted when Mongoose lost connection to the MongoDB server. This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.
   * - close: Emitted after Connection#close() successfully closes the connection. If you call conn.close(), you'll get both a 'disconnected' event and a 'close' event.
   * - reconnected: Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected. Mongoose attempts to automatically reconnect when it loses connection to the database.
   * - error: Emitted if an error occurs on a connection, like a parseError due to malformed data or a payload larger than 16MB.
   * - fullsetup: Emitted when you're connecting to a replica set and Mongoose has successfully connected to the primary and at least one secondary.
   * - all: Emitted when you're connecting to a replica set and Mongoose has successfully connected to all servers specified in your connection string.
   *
   * @private
   */
  private attachConnectionListeners(): void {
    const events = [
      'connecting',
      'connected',
      'open',
      'disconnecting',
      'disconnected',
      'close',
      'reconnected',
      'error',
      'fullsetup',
      'all',
    ];
    const mongooseConnection = this.getConnection();
    for (const event of events) {
      mongooseConnection.on(event, (...args: unknown[]) => {
        if (Array.isArray(args) && args.length > 0) {
          console.log(
            `Mongoose connection service triggered an event: "${event}" with args: "${args}"`
          );
        } else {
          console.log(
            `Mongoose connection service triggered an event: "${event}"`
          );
        }
      });
    }
  }

  /**
   * Given no parameters, it establishes a connection to the MongoDB database.
   * It returns a Promise that resolves to void.
   * If the connection fails, it throws an error.
   */
  public async establishConnection(): Promise<void> {
    try {
      this.attachConnectionListeners();
      await mongoose.connect(this.getEncodedMongoURI(), {
        //mongoose options
        dbName: this.config.mongodbBase,
      });
      console.log('> Mongodb connection established');
    } catch (error) {
      console.error(
        `Error during MongoDB connection in MongoDBService::establishConnection ${error}`
      );
      throw error;
    }
  }

  /**
   * Given no parameters, it returns the MongoDB connection.
   */
  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export default MongoDBService;
