import { Equal } from "typeorm";
import { AppDataSource } from "../datasource";
import { User } from "../entity/user.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  createUser(
    lastName: string,
    firstName: string,
    email: string,
    username: string,
    password: string,
    provider: string,
    isCompleted: boolean,
    isGuest: boolean = false
  ) {
    let user = new User();
    user.lastName = lastName;
    user.firstName = firstName;
    user.email = email;
    user.username = username;
    user.password = password;
    user.provider = provider;
    user.isCompleted = isCompleted;
    user.isGuest = isGuest;
    return user;
  },
  async getRegisterUserClassique() {
    return UserRepository.count({
      where: {
        provider: Equal("split_api"),
      },
    });
  },
  async getRegisterUserGoogle() {
    return UserRepository.count({
      where: {
        provider: Equal("google_account"),
      },
    });
  },
  async getRegisterUserApple() {
    return UserRepository.count({
      where: {
        provider: Equal("apple_account"),
      },
    });
  },
  async getTotalUsers() {
    return UserRepository.count({
      where: {
        isGuest: false,
      },
    });
  },
  async getTotalGuests() {
    return UserRepository.count({
      where: {
        isGuest: true,
      },
    });
  },
});
