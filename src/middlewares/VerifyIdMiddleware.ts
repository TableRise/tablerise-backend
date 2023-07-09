import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';

export default function VerifyIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const { id } = req.params;

  const isValidMongoID = mongoose.isValidObjectId(id);

  if (!isValidMongoID) {
    const err = new Error('The parameter id is invalid');
    err.stack = HttpStatusCode.BAD_REQUEST.toString();
    err.name = 'Invalid Entry';

    throw err;
  }

  next();
}
