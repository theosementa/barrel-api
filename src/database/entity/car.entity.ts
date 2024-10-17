import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Entry } from "./entry.entity";
import { User } from "./user.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @OneToMany(() => Entry, (entry) => entry.car)
  entries: Entry[];

  @ManyToOne(() => User, (user) => user.cars)
  user: User;
}
