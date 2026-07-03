import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
};

export const validateQuery = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    res.locals.query = schema.parse(req.query);
    next();
  };
};
