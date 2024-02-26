import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {
  And,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import {isDate, isEmail, isNumber} from "class-validator";
import {ProfileDto} from "./dto/profile.dto";
import {ProfileEntity} from "./entities/profile.entity";
@Injectable()
export class UserBuilderService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>
  ) {}
  async findAll(search: string) {
    //Like, ILike
    //Not
    //MoreThan, MoreThanOrEqual, LessThan, LessThaOrEqual,
    let where: FindOptionsWhere<UserEntity> = {};
    if (search && isDate(new Date(search))) {
      let date = new Date(search);
      let started_at = new Date(date.setUTCHours(0, 0, 0));
      let finished_at = new Date(date.setUTCHours(23, 59, 59));
      where["created_at"] = And(
        MoreThanOrEqual(started_at),
        LessThanOrEqual(finished_at)
      );
    }
    return await this.userRepository
      .createQueryBuilder("user")
      .where(where)
      .getMany();
  }
  async blogsOfUser(userId: number) {
    return await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.blogs", "blogs")
      .where({id: userId})
      .getOne();
  }
  async orderData() {
    return await this.userRepository
      .createQueryBuilder("user")
      .orderBy("user.age", "DESC")
      .getMany();
  }
  async pagination(paginationDto: {page: number; limit: number}) {
    let {page = 0, limit = 5} = paginationDto;
    if (!page || page <= 1) page = 0;
    else page = page - 1;
    if (!limit || limit <= 0) limit = 5;
    const skip = page * limit;
    console.log(page, limit, skip);

    return await this.userRepository
      .createQueryBuilder("user")
      .orderBy("user.id", "ASC")
      .take(limit)
      .skip(skip)
      .getMany();
  }
  async selection() {
    // return await this.userRepository.find({
    //   where: {},
    //   select: {
    //     first_name: true,
    //     last_name: true,
    //     age: true,
    //   },
    // });
    return await this.userRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.first_name", "user.last_name", "user.age"])
      .getMany();
  }
  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where({id})
      .getOne();
    if (!user) throw new NotFoundException();
    return user;
  }
  async findUserWithProfile(id: number) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .getOne();
    if (!user) throw new NotFoundException();
    return user;
  }
}
