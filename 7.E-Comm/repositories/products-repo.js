import { Repository } from "./repository.js";

class ProductsRepository extends Repository {}

export const productsRepo = new ProductsRepository('products.json');