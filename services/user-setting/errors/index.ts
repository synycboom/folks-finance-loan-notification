import express from 'express';
import logger from '../utils/logger';

type ValidationErrorSpec = {
  msg: string,
  param: string,
  value?: string,
  location?: string,
}

export class ValidationError extends Error {
  private errors: ValidationErrorSpec[];

  constructor(errors: ValidationErrorSpec[]) {
    super('ValidationError');
    this.name = 'ValidationError';
    this.errors = errors || [];
  }

  add(err: ValidationErrorSpec) {
    this.errors.push(err);
  }

  toResponse() {
    const { errors } = this;

    return {
      errors
    };
  }
};

export class UnauthorizedError extends Error {
  constructor() {
    super('UnauthorizedError');
    this.name = 'UnauthorizedError';
  }
};

export class NotFoundError extends Error {
  constructor() {
    super('NotFoundError');
    this.name = 'NotFoundError';
  }
};

export class NoContentError extends Error {
  constructor() {
    super('NoContentError');
    this.name = 'NoContentError';
  }
};

export const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json(err.toResponse());
  }
  if (err instanceof NotFoundError) {
    return res.status(404).send('Not Found');
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).send('Unauthorized');
  }
  if (err instanceof NoContentError) {
    return res.status(204).end();
  }

  logger.error('unknown error', { message: err.message, stack: err.stack } );

  res.status(500).send('Internal Server Error');
};
