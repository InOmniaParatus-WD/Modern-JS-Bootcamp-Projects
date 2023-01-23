import express from "express";
import { productsRepo } from "../repositories/products-repo.js";
import { productCard } from "../views/products-home/index.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  const products = await productsRepo.getAll();

  res.send(productCard({ products }));
});
