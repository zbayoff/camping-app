export {};

import { Types } from 'mongoose';


declare global {
  namespace Express {
    interface Request {
      user: any;
      userId: Types.ObjectId;
    }
  }
}