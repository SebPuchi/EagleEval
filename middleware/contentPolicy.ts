import helmet from 'helmet';

const trusted = ["'self'"];

if (process.env['NODE_ENV'] !== 'production') {
  trusted.push('http://localhost:*', 'ws://localhost:*');
}

export default function contentSecurityPolicy() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'", "'unsafe-inline'"].concat(trusted),
        scriptSrc: ["'self'", "'unsafe-inline'"].concat(trusted),
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  });
}
