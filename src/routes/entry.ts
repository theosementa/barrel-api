import express = require("express");
import { User } from "../database/entity/user.entity";
import { AverageRepository } from "../database/repository/average.repository";
import { CarRepository } from "../database/repository/car.repository";
import { EntryRepository } from "../database/repository/entry.repository";
import { EstimationRepository } from "../database/repository/estimation.repository";
import { StatisticsRepository } from "../database/repository/statistics.repository";

export const entryRouter = express.Router();

entryRouter.get("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Get one entry.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'id of entry',
            required: true,
            type: 'number'
        }
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
  const { carID, mileage, price, liter, date } = req.body;

  if (!date || !carID) {
    return res.status(422).json({
      message: !date ? "Date missing" : "CarID missing",
    });
  }

  const user: User = res.locals.connectedUser;
  const carIDParsed = parseInt(carID);
  const car = await CarRepository.findOne({
    where: {
      id: carIDParsed,
      user: { id: user.id },
    },
    relations: { entries: true, statistics: true },
  });

  if (!car) return res.status(404).json({ message: "Car not found" });

  const newEntry = EntryRepository.createNewEntry(
    { mileage, price, liter, date },
    car
  );
  if (!newEntry)
    return res.status(400).json({ message: "All fields are empty." });

  await EntryRepository.save(newEntry);

  car.statistics = StatisticsRepository.updateCarStatistics(car);
  await AverageRepository.save(car.statistics.average);
  await EstimationRepository.save(car.statistics.estimation);
  car.statistics.car = car;
  await StatisticsRepository.save(car.statistics);
  await CarRepository.save(car);

  const updatedCar = await CarRepository.findOne({
    where: { id: parseInt(carID), user: { id: user.id } },
    relations: {
      entries: true,
      statistics: { estimation: true, average: true },
    },
  });

  return res.send(updatedCar);
});

entryRouter.put("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry/{id}'
        #swagger.method = 'put'
        #swagger.description = 'Edit one entry.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'id of entry',
            required: true,
            type: 'number'
        }
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

  const { mileage, price, liter, dateISO } = req.body;
  const mileageParsed = parseInt(mileage);
  const priceParsed = parseFloat(price);
  const literParsed = parseFloat(liter);
  const dateParsed = new Date(dateISO);

  entry.mileage = mileage != null ? entry.mileage : mileageParsed;
  entry.price = price != null ? entry.price : priceParsed;
  entry.liter = liter != null ? entry.liter : literParsed;
  entry.date = dateParsed;

  await EntryRepository.save(entry);
  return res.send(entry);
});

entryRouter.delete("/:id", async (req, res) => {
  /*  #swagger.tags = ['Entry']
        #swagger.path = '/entry/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Delete one entry.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'id of entry',
            required: true,
            type: 'number'
        }
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
