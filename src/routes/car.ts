import express = require("express");
import { Car } from "../database/entity/car.entity";
import { User } from "../database/entity/user.entity";
import { CarRepository } from "../database/repository/car.repository";

export const carRouter = express.Router();

carRouter.get("/", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car'
        #swagger.method = 'get'
        #swagger.description = 'Get all the cars.'
        #swagger.responses[200] = {
            description: 'User cars retrieved successfully.',
            schema: {
                $ref: '#/definitions/Car'
            }
        }
  */
  const user: User = res.locals.connectedUser;
  return res.send(await CarRepository.findBy({ user: { id: user.id } }));
});

carRouter.post("/", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car'
        #swagger.method = 'post'
        #swagger.description = 'Create a new car.'
  */

  const { name } = req.body;
  const user: User = res.locals.connectedUser;

  const newCar = new Car();
  newCar.name = name;
  newCar.user = user;

  await CarRepository.save(newCar);

  return res.send(newCar);
});

carRouter.delete("/:id", async (req, res) => {
  /*  #swagger.tags = ['Car']
        #swagger.path = '/car/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Delete a car.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'id of the car',
            required: true,
            type: 'number'
        }
  */

  const user: User = res.locals.connectedUser;
  const carID = parseInt(req.params.id);
  const carToDelete = await CarRepository.findOneBy({
    id: carID,
    user: { id: user.id },
  });

  if (carToDelete) {
    await CarRepository.delete(carToDelete);
    return res.sendStatus(200);
  } else {
    return res.status(404).json({ message: "Car not found" });
  }
});
