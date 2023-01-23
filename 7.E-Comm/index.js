import express from "express";
import bodyParser from "body-parser"; //external library which does the same thing as the bodyParser function commented at the bottom of the file

import cookieSession from "cookie-session";

import { authRouter } from "./routes/admin/auth.js";
import { productsRouter } from "./routes/products-listing.js";
import { cartsRouter } from "./routes/carts-routes.js";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); //every route handlers would use the middleware function inside the application whenever we need to
app.use(
  cookieSession({
    keys: ["sfdgsdh"],
  })
);
app.use(authRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log("Listening");
});

//-----------------------------------------------------------
// Middleware helper function (replaced with external library)
//-----------------------------------------------------------
/* const bodyParser = (req, res, next) => {
  if (req.method === "POST") {
    //get access to email, password, passwordConfirmation
    //"on" method is the equivalent of addEventListener DOM method
    req.on("data", (data) => {
      const parsed = data.toString("utf8").split("&");
      const formData = {};
      for (let pair of parsed) {
        const [key, value] = pair.split("=");
        formData[key] = value;
      }
      req.body = formData;
      next();
    });
  } else {
    next();
  }
}; */
