import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Car } from "./car.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: null, nullable: true, unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  createdAt: Date;

  @Column({ default: null, nullable: true })
  provider: string;

  @Column({ default: true })
  isCompleted: boolean;

  @Column({ default: false })
  isGuest: boolean;

  @Column({ default: false, select: false })
  isDeleted: boolean;

  @Column({ default: null, select: false, nullable: true })
  deletedAt: Date;

  @Column({ default: false, select: false })
  isAnonymise: boolean;

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];
}
