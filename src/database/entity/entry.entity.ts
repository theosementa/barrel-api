import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "./car.entity";

@Entity()
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  mileage: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  liter: number;

  @Column()
  date: Date;

  @ManyToOne(() => Car, (car) => car.entries)
  car: Car;
}
