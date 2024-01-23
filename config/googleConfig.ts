import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  OAuthCreds: {
    id: process.env['GOOGLE_CLIENT_ID'] as string,
    secret: process.env['GOOGLE_CLIENT_SECRET'] as string,
    session: process.env['COOKIE_KEY'] as string,
  },
};
