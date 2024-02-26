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
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>
  ) {}
  async create(createDto: CreateUserDto) {
    const {first_name, last_name, email, age} = createDto;
    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      age,
    });
    return await this.userRepository.save(user);
  }
  async insert(createDto: CreateUserDto) {
    const {first_name, last_name, email, age} = createDto;
    return await this.userRepository.insert({
      first_name,
      last_name,
      email,
      age,
    });
  }
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
    return await this.userRepository.find({
      where,
    });
  }
  async blogsOfUser(userId: number) {
    return await this.userRepository.findOne({
      where: {id: userId},
      relations: {
        blogs: true,
      },
    });
  }
  async orderData() {
    return await this.userRepository.find({
      where: {},
      order: {age: "ASC"},
    });
  }
  async pagination(paginationDto: {page: number; limit: number}) {
    let {page = 0, limit = 5} = paginationDto;
    if (!page || page <= 1) page = 0;
    else page = page - 1;
    if (!limit || limit <= 0) limit = 5;
    const skip = page * limit;
    console.log(page, limit, skip);

    return await this.userRepository.find({
      where: {},
      order: {id: "ASC"},
      take: limit,
      skip,
    });
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
    return await this.userRepository.find({
      where: {},
      select: ["id", "first_name", "last_name", "age"],
    });
  }
  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id});
    if (!user) throw new NotFoundException();
    return user;
  }
  async updateChangedFields(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const {age, email, first_name, last_name} = updateUserDto;
    if (age && isNumber(age)) user.age = age;
    if (email && isEmail(email)) user.email = email;
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    await this.userRepository.save(user);
    return {
      message: "updated successfully",
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const {age, email, first_name, last_name} = updateUserDto;
    await this.userRepository.update({id}, {age, email, first_name, last_name});
    return {
      message: "updated successfully",
    };
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return {
      message: "removed successfully",
    };
  }
  async delete(id: number) {
    await this.findOne(id);
    await this.userRepository.delete({id});
    return {
      message: "deleted successfully",
    };
  }
  async createProfile(profileDto: ProfileDto) {
    const {bio, photo, userId} = profileDto;
    const user = await this.userRepository.findOneBy({id: userId});
    if (user) {
      const profile = await this.profileRepository.findOneBy({userId});
      if (profile) {
        if (bio) profile.bio = bio;
        if (photo) profile.photo = photo;
        await this.profileRepository.save(profile);
      } else {
        let newProfile = this.profileRepository.create({
          bio,
          photo,
          userId,
        });
        newProfile = await this.profileRepository.save(newProfile);
        user.profileId = newProfile.id;
        await this.userRepository.save(user);
      }
      return {
        message: "profile created./update successfully",
      };
    }
    throw new NotFoundException();
  }
  async findUserWithProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: {id},
      relations: {
        profile: true,
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }
}
