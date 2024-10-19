import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Statistics } from "./statistics.entity";

@Entity()
export class Estimation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mileageAtEndOfCurrentYear: number;

  @Column({ nullable: true })
  mileageAtEndOfTheCurrentMonth: number;

  @OneToOne(() => Statistics, (statistics) => statistics.estimation)
  statistics: Statistics;
}
