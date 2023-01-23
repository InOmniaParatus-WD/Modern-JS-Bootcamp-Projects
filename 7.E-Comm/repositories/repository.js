import fs from "fs";
import crypto from "crypto";

export class Repository {
  constructor(filename) {
    if (!filename) {
      throw Error("Creating a repository requires a filename");
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attributes) {
    attributes.id = this.randomID();

    const records = await this.getAll();
    records.push(attributes);
    await this.writeAll(records);

    return attributes;
  }

  //Get a list of all the users
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  //Writes all users to a user.js file
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  //Generate a random ID for each entered product
  randomID() {
    return crypto.randomBytes(4).toString("hex");
  }

  //Find the user with a given ID
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  //Delete the user with a specified ID
  async delete(id) {
    const records = await this.getAll();
    const filterRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filterRecords);
  }

  //Updates the user with the given id using the given attributes
  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id of ${id} not found`);
    }
    //Update the object found by its id, by taking the key-value pairs inside the "attributes" object and add them to the "record" object
    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  // Finds one user with the given filters
  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}
