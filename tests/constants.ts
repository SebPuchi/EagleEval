// CONSTANTS USER FOR TESTING
import { Types } from 'mongoose';

export const VALID_USER_ID = new Types.ObjectId('4cd1ecefa5c1565471a01a31');
export const INVALID_USER_ID = new Types.ObjectId('1b5080c1920924d919660d43');
export const VALID_COMMENT_ID = new Types.ObjectId('04ba976dea66e78cb93dd1f2');
export const INVALID_COMMENT_ID = new Types.ObjectId(
  'aabf9d44ef1cb292ad4ee0a8'
);
export const VALID_TOKEN = '123456';
export const SESSION_SECRET = '444632039faaa0e9ace20ce9';
