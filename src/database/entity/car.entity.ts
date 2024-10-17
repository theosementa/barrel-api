import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entry } from "./entry.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @OneToMany(() => Entry, (entry) => entry.car)
  entries: Entry[];
}
