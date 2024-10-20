import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Average } from "./average.entity";
import { Car } from "./car.entity";
import { Estimation } from "./estimation.entity";

@Entity()
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Car, (car) => car.statistics)
  car: Car;

  @OneToOne(() => Estimation, (estimation) => estimation.statistics, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  estimation: Estimation;

  @OneToOne(() => Average, (average) => average.statistics, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  average: Average;
}
