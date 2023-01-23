import express from "express";
import { cartsRepo } from "../repositories/carts-repo.js";
import { productsRepo } from "../repositories/products-repo.js";
import { cartShowTemplate } from "../views/carts/show.js";

export const cartsRouter = express.Router();

// Recive a POST request to add an item to a cart
cartsRouter.post("/cart/products", async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // We don't have a cart, we need to create one,
    // and store the cart id on the req.session.cartId property;

    cart = await cartsRepo.create({
      items: [],
    });
    req.session.cartId = cart.id;
  } else {
    //We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    // increment quantity for the existing product
    existingItem.quantity++;
  } else {
    // add the new product to the item array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.send("Product added to cart");
});

// Receive a GET request to show all items in cart
cartsRouter.get("/cart", async (req, res) => {
  // user has a cart assigned to them
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});
// Receive a POST to delete an item in the cart
cartsRouter.post("/cart/products/delete", async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);
  
  await cartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});
