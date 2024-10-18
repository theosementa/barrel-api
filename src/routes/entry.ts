import express = require("express");
import { Entry } from "../database/entity/entry.entity";
import { User } from "../database/entity/user.entity";
import { CarRepository } from "../database/repository/car.repository";
import { EntryRepository } from "../database/repository/entry.repository";

export const entryRouter = express.Router();

entryRouter.get("/:carID", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'get'
        #swagger.description = 'Get all entries for a car.'
  */
  const user: User = res.locals.connectedUser;
  const carID = parseInt(req.params.carID);
  return res.send(
    await EntryRepository.find({
      where: {
        car: {
          id: carID,
          user: { id: user.id },
        },
      },
    })
  );
});

entryRouter.get("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'get'
        #swagger.description = 'Get one entry.'
  */

  const user: User = res.locals.connectedUser;
  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({
    id: entryID,
    car: {
      user: { id: user.id },
    },
  });

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
  if (!date) {
    return res.status(422).json({ message: "Date missing" });
  }
  if (!carID) {
    return res.status(422).json({ message: "CarID missing" });
  }

  const user: User = res.locals.connectedUser;
  const carIDParsed = parseInt(carID);
  const car = await CarRepository.findOneBy({
    id: carIDParsed,
    user: { id: user.id },
  });
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const mileageParsed = parseInt(mileage);
  const priceParsed = parseFloat(price);
  const literParsed = parseFloat(liter);

  if (mileageParsed != 0 || priceParsed != 0 || literParsed != 0) {
    const newEntry = new Entry();
    newEntry.mileage = mileage != null ? mileageParsed : null;
    newEntry.price = price != null ? priceParsed : null;
    newEntry.liter = liter != null ? literParsed : null;
    newEntry.date = date;
    newEntry.car = car;

    await EntryRepository.save(newEntry);
    return res.send(newEntry);
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

  const user: User = res.locals.connectedUser;
  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({
    id: entryID,
    car: {
      user: { id: user.id },
    },
  });

  if (!entry) {
    return res.status(404).json({ message: "Entry not found" });
  }

  const { mileage, price, liter, date } = req.body;
  const mileageParsed = parseInt(mileage);
  const priceParsed = parseFloat(price);
  const literParsed = parseFloat(liter);

  entry.mileage = mileage != null ? entry.mileage : mileageParsed;
  entry.price = price != null ? entry.price : priceParsed;
  entry.liter = liter != null ? entry.liter : literParsed;

  await EntryRepository.save(entry);
  return res.send(entry);
});

entryRouter.delete("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry'
        #swagger.method = 'delete'
        #swagger.description = 'Delete one entry.'
  */

  const user: User = res.locals.connectedUser;
  const entryID = parseInt(req.params.id);
  const entry = await EntryRepository.findOneBy({
    id: entryID,
    car: {
      user: { id: user.id },
    },
  });

  if (entry) {
    await EntryRepository.delete(entry);
    return res.sendStatus(200);
  } else {
    return res.status(404).json({ message: "Entry not found" });
  }
});
