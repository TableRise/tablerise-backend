import { NextFunction, Request, Response } from 'express';

function ErrorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
  if (!Number(err.stack)) return res.status(500).send(err.message);
  return res.status(Number(err.stack)).json({
    name: err.name,
    message: JSON.parse(err.message)
  });
}

export default ErrorMiddleware;
