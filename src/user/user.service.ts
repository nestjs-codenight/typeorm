import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}
  async create() {
    const user = this.userRepository.create({
      first_name: "Erfan",
      last_name: "Yousefi",
      age: 28,
      email: "erfan@codenight.ir",
    });
    return await this.userRepository.save(user);
  }
  async insert() {
    return await this.userRepository.insert({
      first_name: "Ali",
      last_name: "Mahmoodi",
      age: 30,
      email: "ali_m@gmail.ir",
    });
  }

  async findAll() {
    return await this.userRepository.findBy({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
