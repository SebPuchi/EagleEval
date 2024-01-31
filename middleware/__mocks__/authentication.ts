// __mocks__/authentication.ts
import * as constants from '../../tests/constants';

export const ensureAuthenticated = jest.fn((req, res, next) => {
  // Mock implementation, you can customize it based on your needs
  if (req.headers.authorization == 'validToken') {
    req.user = { _id: constants.VALID_USER_ID }; // Mock user object
    next(); // Call next middleware
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
