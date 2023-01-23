import express from "express";
import multer from "multer";

import { handleErrors, requireAuth } from "./middlewares.js";
import { productsRepo } from "../../repositories/products-repo.js";
import { newProductTemplate } from "../../views/admin/products/new.js";
import { productIndexTemplate } from "../../views/admin/products/index.js";
import { productEditTemplate } from "../../views/admin/products/edit.js";
import { requireTitle, requirePrice } from "./validators.js";

export const adminProductsRouter = express.Router();
const uploadFile = multer({ storage: multer.memoryStorage() });

// List out all the different products to an administrator
adminProductsRouter.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productIndexTemplate({ products }));
});

// Form that allows the user to create a new product
adminProductsRouter.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(newProductTemplate({}));
});

//CREATE => Submit the form with a new product
adminProductsRouter.post(
  "/admin/products/new",
  requireAuth,
  uploadFile.single("image"),
  [requireTitle, requirePrice],
  handleErrors(newProductTemplate),

  async (req, res) => {
    const image = req.file.buffer.toString("base64"); //safely representing an image in a string format
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    // READ => listing all the products plus the newly added one
    res.redirect("/admin/products");
  }
);

// Showing the product edit form to the user => .get()
adminProductsRouter.get(
  "/admin/products/:id/edit",
  requireAuth,
  async (req, res) => {
    const product = await productsRepo.getOne(req.params.id);

    if (!product) {
      return res.send("Product not found");
    }

    res.send(productEditTemplate({ product }));
  }
);

// UPDATE => Submitting the form with the updated product details
adminProductsRouter.post(
  "/admin/products/:id/edit",
  requireAuth,
  uploadFile.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }

    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("Could not find item");
    }

    res.redirect("/admin/products");
  }
);

// Deleting products from the product list
adminProductsRouter.post(
  "/admin/products/:id/delete",
  requireAuth,
  async (req, res) => {
    await productsRepo.delete(req.params.id);
    res.redirect("/admin/products");
  }
);
