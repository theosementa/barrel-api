import { AppDataSource } from "../datasource";
import { User } from "../entity/user.entity";

export const UserRepository = AppDataSource.getRepository(User).extend({
  createUser(username: string, password: string) {
    let user = new User();
    user.username = username;
    user.password = password;
    user.createdAt = new Date();
    return user;
  },
  async getTotalUsers() {
    return UserRepository.count({});
  },
});
