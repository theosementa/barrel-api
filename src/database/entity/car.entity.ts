import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { daysBetween } from "../../utils/date/date";
import { MileageData } from "../model/MileageData.model";
import { Entry } from "./entry.entity";
import { Statistics } from "./statistics.entity";
import { User } from "./user.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @OneToMany(() => Entry, (entry) => entry.car, { cascade: true })
  entries: Entry[];

  @ManyToOne(() => User, (user) => user.cars)
  user: User;

  @OneToOne(() => Statistics, (statistics) => statistics.car, { cascade: true })
  @JoinColumn()
  statistics: Statistics;

  get mileages(): MileageData[] {
    if (this.entries) {
      return this.entries
        .filter((entry) => entry.mileage != 0)
        .map((entry) => new MileageData(entry.mileage, entry.date))
        .sort((a, b) => a.value - b.value);
    } else {
      return [];
    }
  }

  get firstMileage(): MileageData | null {
    return this.mileages.length > 0 ? this.mileages[0] : null;
  }

  get lastMileage(): MileageData | null {
    return this.mileages.length > 0
      ? this.mileages[this.mileages.length - 1]
      : null;
  }

  get mileageTraveled(): number {
    if (this.mileages.length > 1 && this.firstMileage && this.lastMileage) {
      return this.lastMileage.value - this.firstMileage.value;
    }
    return 0;
  }

  get daysTraveled(): number {
    if (this.mileages.length > 1 && this.firstMileage && this.lastMileage) {
      return daysBetween(this.firstMileage.date, this.lastMileage.date);
    }
    return 0;
  }
}
