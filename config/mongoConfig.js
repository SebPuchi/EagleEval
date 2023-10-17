// config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongodb: {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
  },
};
