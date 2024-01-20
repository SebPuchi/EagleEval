import * as dotenv from 'dotenv';
dotenv.config();

interface MongoDBConfig {
  username: string | undefined;
  password: string | undefined;
  databaseURL: string | undefined;
}

interface Config {
  mongodb: MongoDBConfig;
}

export const config: Config = {
  mongodb: {
    username: process.env['MONGODB_USERNAME'],
    password: process.env['MONGODB_PASSWORD'],
    databaseURL: process.env['MONGODB_URL'],
  },
};
