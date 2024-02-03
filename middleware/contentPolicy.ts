import helmet from 'helmet';
import { Request, Response } from 'express';

const trusted = ["'self'"];

if (process.env['NODE_ENV'] !== 'production') {
  trusted.push('http://localhost:*', 'ws://localhost:*');
}

export default function contentSecurityPolicy() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ['https://eagleeval.com'].concat(trusted),
        scriptSrcAttr: ['https://eagleeval.com', "'unsafe-inline'"].concat(
          trusted
        ),
        scriptSrc: [
          'https://www.eagleeval.com',
          //"'unsafe-inline'",
          (req: any, res: any) => `'nonce-${res.locals['cspNonce']}'`,
        ].concat(trusted),
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        imgSrc: ['https://bc.edu:*', 'https://www.bc.edu:*'].concat(trusted),
      },
    },
  });
}
