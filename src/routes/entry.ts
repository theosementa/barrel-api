import express = require("express");
import { Entry } from "../database/entity/entry.entity";
import { CarRepository } from "../database/repository/car.repository";
import { EntryRepository } from "../database/repository/entry.repository";

const entryRouter = express.Router();

entryRouter.get("/", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'get'
        #swagger.description = 'Get all entries.'
  */

  return res.send(await EntryRepository.find());
});

entryRouter.get("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'get'
        #swagger.description = 'Get one entry.'
  */

  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({ id: entryID });

  if (entry) {
    return res.send(entry);
  } else {
    return res.status(404).json({ message: "Entry not found." });
  }
});

entryRouter.post("/", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'post'
        #swagger.description = 'Create one entry.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Entry creation data',
            required: true,
            schema: {
                $ref: '#/definitions/Entry'
            }
        }
  */

  const { carID, mileage, price, liter, date } = req.body;
  const carIDParsed = parseInt(carID);

  const car = await CarRepository.findOneBy({ id: carIDParsed });
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const mileageParsed = parseInt(mileage);
  const priceParsed = parseFloat(price);
  const literParsed = parseFloat(liter);

  if (mileageParsed != 0 || priceParsed != 0 || literParsed != 0) {
    const newEntry = new Entry();
    newEntry.mileage = mileageParsed;
    newEntry.price = priceParsed;
    newEntry.liter = literParsed;
    newEntry.date = date;
    newEntry.car = car;

    await EntryRepository.save(newEntry);
    return res.send(newEntry); //TODO : ça va retourner 'car' que j'ai pas besoin ici non ?
  } else {
    return res.status(400).json({ message: "All fields are empty." });
  }
});

entryRouter.put("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'put'
        #swagger.description = 'Edit one entry.'
  */

  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({ id: entryID });

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  const { mileage, price, liter, date } = req.body;
  const mileageParsed = parseInt(mileage);
  const priceParsed = parseFloat(price);
  const literParsed = parseFloat(liter);

  entry.mileage = mileageParsed === 0 ? entry.mileage : mileageParsed;
  entry.price = priceParsed === 0 ? entry.price : priceParsed;
  entry.liter = literParsed === 0 ? entry.liter : literParsed;

  await EntryRepository.save(entry);
  return res.send(entry); //TODO : ça va retourner 'car' que j'ai pas besoin ici non ?
});

entryRouter.delete("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'delete'
        #swagger.description = 'Delete one entry.'
  */

  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({ id: entryID });

  if (entry) {
    await EntryRepository.delete(entry);
    return res.sendStatus(200);
  } else {
    return res.status(404).json({ message: "Entry not found" });
  }
});
