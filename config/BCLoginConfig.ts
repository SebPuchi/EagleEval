import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  bcAuth: {
    username: process.env['BC_USERNAME'] as string,
    password: process.env['BC_PASSWORD'] as string,
  },
};
