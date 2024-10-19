import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Statistics } from "./statistics.entity";

@Entity()
export class Average {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mileagePerDay: number;

  @Column()
  mileagePerMonth: number;

  @Column()
  mileagePerYear: number;

  @OneToOne(() => Statistics, (statistics) => statistics.average)
  statistics: Statistics;
}
