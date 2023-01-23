import { Repository } from "./repository.js";

class CartsRepository extends Repository {}

export const cartsRepo = new CartsRepository('carts.json');