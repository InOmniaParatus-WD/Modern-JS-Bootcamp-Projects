import express from "express";

import { handleErrors } from "./middlewares.js";

import { users } from "../../repositories/users.js";
import { signUpTemplate } from "../../views/admin/auth/signup.js";
import { signInTemplate } from "../../views/admin/auth/signin.js";

import {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  checkUserExists,
  checkValidPassword,
} from "./validators.js";

// ----------- Subrouter -----------
export const authRouter = express.Router();

// ----------- User Sign Up -----------
authRouter.get("/signup", (req, res) => {
  res.send(signUpTemplate({ req }));
});

authRouter.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signUpTemplate),

  async (req, res) => {
    const { email, password } = req.body;
    const user = await users.create({ email, password });

    req.session.userId = user.id;
  }
);

// ----------- User Sign Out -----------
authRouter.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

// ----------- User Sign In -----------
authRouter.get("/signin", (req, res) => {
  res.send(signInTemplate({}));
});

authRouter.post(
  "/signin",
  [checkUserExists, checkValidPassword],
  handleErrors(signInTemplate),

  async (req, res) => {
    const { email } = req.body;

    const user = await users.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

