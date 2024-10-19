import { AppDataSource } from "../datasource";
import { Average } from "../entity/average.entity";

export const AverageRepository = AppDataSource.getRepository(Average).extend(
  {}
);
