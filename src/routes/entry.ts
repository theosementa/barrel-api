import express = require("express");
import { Average } from "../database/entity/average.entity";
import { Entry } from "../database/entity/entry.entity";
import { Estimation } from "../database/entity/estimation.entity";
import { Statistics } from "../database/entity/statistics.entity";
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

  if (!date) {
    return res.status(422).json({ message: "Date missing" });
  }
  if (!carID) {
    return res.status(422).json({ message: "CarID missing" });
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

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  const mileageParsed = mileage != null ? parseInt(mileage) : 0;
  const priceParsed = price != null ? parseFloat(price) : 0;
  const literParsed = liter != null ? parseFloat(liter) : 0;
  const dateParsed = new Date(date);

  if (mileageParsed !== 0 || priceParsed !== 0 || literParsed !== 0) {
    const newEntry = new Entry();
    newEntry.mileage = mileageParsed || null;
    newEntry.price = priceParsed || null;
    newEntry.liter = literParsed || null;
    newEntry.date = dateParsed;
    newEntry.car = car;

    // Sauvegarder la nouvelle entrée
    car.entries.push(newEntry);
    await EntryRepository.save(newEntry);

    // Mettre à jour les estimations et moyennes de manière séparée
    let statistics = car.statistics ?? new Statistics();

    if (!statistics.average) {
      statistics.average = new Average();
    }
    statistics.average.mileagePerDay =
      StatisticsRepository.getAveragePerDay(car);
    statistics.average.mileagePerMonth =
      StatisticsRepository.getAveragePerMonth(car);
    statistics.average.mileagePerYear =
      StatisticsRepository.getAveragePerYear(car);

    if (!statistics.estimation) {
      statistics.estimation = new Estimation();
    }
    statistics.estimation.mileageAtEndOfCurrentYear =
      StatisticsRepository.getEstimatedMileageAtEndOfCurrentYear(car);
    statistics.estimation.mileageAtEndOfTheCurrentMonth =
      StatisticsRepository.getEstimatedMileageAtEndOfCurrentMonth(car);

    // Sauvegarder les statistiques et les objets liés (Average et Estimation)
    await AverageRepository.save(statistics.average); // Assurez-vous que vous avez un AverageRepository
    await EstimationRepository.save(statistics.estimation); // Assurez-vous que vous avez un EstimationRepository
    statistics.car = car;
    await StatisticsRepository.save(statistics);

    car.statistics = statistics; // Associer les statistiques mises à jour à la voiture
    await CarRepository.save(car);

    // Récupérer la voiture mise à jour
    const updatedCar = await CarRepository.findOne({
      where: {
        id: carIDParsed,
        user: { id: user.id },
      },
      relations: {
        entries: true,
        statistics: { estimation: true, average: true },
      },
    });

    return res.send(updatedCar);
  } else {
    return res.status(400).json({ message: "All fields are empty." });
  }
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
