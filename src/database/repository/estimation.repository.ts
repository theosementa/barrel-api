import { AppDataSource } from "../datasource";
import { Estimation } from "../entity/estimation.entity";

export const EstimationRepository = AppDataSource.getRepository(
  Estimation
).extend({});
