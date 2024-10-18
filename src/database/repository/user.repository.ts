import { AppDataSource } from "../datasource";
import { User } from "../entity/user.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  createUser(
    lastName: string,
    firstName: string,
    email: string,
    username: string,
    password: string
  ) {
    let user = new User();
    user.lastName = lastName;
    user.firstName = firstName;
    user.email = email;
    user.username = username;
    user.password = password;
    return user;
  },
  async getTotalUsers() {
    return UserRepository.count({});
  },
});
