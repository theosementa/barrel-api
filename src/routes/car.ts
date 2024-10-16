import express = require("express");
import { Car } from "../database/entity/car.entity";
import { CarRepository } from "../database/repository/car.repository";

const carRouter = express.Router();

carRouter.get("/", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car'
        #swagger.method = 'get'
        #swagger.description = 'Get all the cars.'
  */

  return res.send(await CarRepository.find());
});

carRouter.post("/", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car'
        #swagger.method = 'post'
        #swagger.description = 'Create a new car.'
  */

  const { name } = req.body;

  const newCar = new Car();
  newCar.name = name;

  await CarRepository.save(newCar);

  return res.send(newCar);
});

carRouter.delete("/:id", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car'
        #swagger.method = 'delete'
        #swagger.description = 'Delete a car.'
  */

  const carID = parseInt(req.params.id);
  const carToDelete = await CarRepository.findOneBy({ id: carID });

  if (carToDelete) {
    await CarRepository.delete(carToDelete);
    return res.sendStatus(200);
  } else {
    return res.status(404).json({ message: "Car not found" });
  }
});
