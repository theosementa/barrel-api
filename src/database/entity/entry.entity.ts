import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "./car.entity";

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mileage: number;

  @Column()
  price: number;

  @Column()
  liter: number;

  @Column()
  date: String;

  @ManyToOne(() => Car, (car) => car.entries)
  car: Car;
}
