import crypto from "crypto";
import util from "util";
import { Repository } from "./repository.js";

const scrypting = util.promisify(crypto.scrypt);
class UsersRepository extends Repository {
  //Creating a new user with the given attributes
  async create(attributes) {
    attributes.id = this.randomID();

    const salt = crypto.randomBytes(8).toString("hex"); // salting the password
    const buf = await scrypting(attributes.password, salt, 64); // hashed password

    const records = await this.getAll();
    const record = {
      ...attributes,
      password: `${buf.toString("hex")}.${salt}`, // encrypting the password stored into JSON file/database
    };

    records.push(record);

    await this.writeAll(records);

    return record;
  }
  //Compares the password with what's stored in the database
  async comparePasswords(saved, supplied) {
    // 'saved' -> the password saved in the database
    // 'supplied' -> the password entered by the user trying to login

    const [hashed, salt] = saved.split(".");
    const hashedSuppliedBuf = await scrypting(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }
}

export const users = new UsersRepository("users.json");
