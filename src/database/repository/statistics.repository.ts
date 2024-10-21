import { AppDataSource } from "../datasource";
import { Average } from "../entity/average.entity";
import { Car } from "../entity/car.entity";
import { Estimation } from "../entity/estimation.entity";
import { Statistics } from "../entity/statistics.entity";

export const StatisticsRepository = AppDataSource.getRepository(
  Statistics
).extend({
  updateCarStatistics(car: Car) {
    const statistics = car.statistics ?? new Statistics();

    statistics.average = statistics.average ?? new Average();
    statistics.average.mileagePerDay = this.getAveragePerDay(car);
    statistics.average.mileagePerMonth = this.getAveragePerMonth(car);
    statistics.average.mileagePerYear = this.getAveragePerYear(car);

    statistics.estimation = statistics.estimation ?? new Estimation();
    statistics.estimation.mileageAtEndOfCurrentYear =
      this.getEstimatedMileageAtEndOfCurrentYear(car);
    statistics.estimation.mileageAtEndOfTheCurrentMonth =
      this.getEstimatedMileageAtEndOfCurrentMonth(car);

    return statistics;
  },
  getEstimatedMileageAtEndOfCurrentYear(car: Car) {
    if (!car.lastMileage) {
      return 0;
    }

    const daysToEndOfYear = car.lastMileage.date.daysToEndOfYear;
    const estimatedAdditionalMileage =
      daysToEndOfYear * this.getAveragePerDay(car);
    const estimatedTotal = car.lastMileage.value + estimatedAdditionalMileage;
    return estimatedTotal;
  },
  getEstimatedMileageAtEndOfCurrentMonth(car: Car) {
    if (!car.lastMileage) {
      return 0;
    }

    const daysToEndOfMonth = car.lastMileage.date.daysToEndOfMonth;
    const estimatedAdditionalMileage =
      daysToEndOfMonth * this.getAveragePerDay(car);
    const estimatedTotal = car.lastMileage.value + estimatedAdditionalMileage;
    return estimatedTotal;
  },
  getAveragePerDay(car: Car) {
    if (car.daysTraveled === 0) {
      return 0;
    }

    return car.mileageTraveled / car.daysTraveled;
  },
  getAveragePerMonth(car: Car) {
    if (car.daysTraveled === 0) {
      return 0;
    }

    const monthTraveled = car.daysTraveled / 30.44;
    return car.mileageTraveled / monthTraveled;
  },
  getAveragePerYear(car: Car) {
    if (car.daysTraveled === 0) {
      return 0;
    }

    const yearTraveled = car.daysTraveled / 365.25;
    return car.mileageTraveled / yearTraveled;
  },
});
