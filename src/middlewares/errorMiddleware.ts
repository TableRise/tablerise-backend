import { NextFunction, Request, Response } from 'express';

abstract class errorMiddleware {
  public static errorResponse(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (!err.stack) return res.status(Number(err.stack)).send(err.message);
    return res.status(Number(err.stack)).json({
      name: err.name,
      message: err.message
    });
  }
}

export default errorMiddleware;
