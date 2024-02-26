import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {ProfileEntity} from "./entities/profile.entity";
import {UserBuilderController} from "./query-builder.controller";
import {UserBuilderService} from "./query-builder.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController, UserBuilderController],
  providers: [UserService, UserBuilderService],
})
export class UserModule {}
