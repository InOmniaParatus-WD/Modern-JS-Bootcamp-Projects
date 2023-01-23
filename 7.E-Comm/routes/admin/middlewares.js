import { validationResult } from "express-validator";

export const handleErrors = (templateFunc, dataCallback) => {
  return async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      let data = {};
      if (dataCallback) {
        data = await dataCallback(req);
      }
      return res.send(templateFunc({ errors, ...data }));
    }
    next();
  };
};

export const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/signin");
  }
  next();
};
