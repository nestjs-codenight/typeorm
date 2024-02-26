import {Controller, Get, Param, Query, ParseIntPipe} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserBuilderService} from "./query-builder.service";

@Controller("user-builder")
export class UserBuilderController {
  constructor(private readonly userService: UserBuilderService) {}

  @Get()
  findAll(@Query("search") search: string) {
    return this.userService.findAll(search);
  }
  @Get("/blogs/:userId")
  findAllBlogsOfUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.blogsOfUser(userId);
  }
  @Get("/profile/:id")
  findUserWithProfile(@Param("id") id: string) {
    return this.userService.findUserWithProfile(+id);
  }
  @Get("/order")
  orderData() {
    return this.userService.orderData();
  }
  @Get("/pagination")
  paginationUser(@Query() paginationDto: {page: number; limit: number}) {
    return this.userService.pagination(paginationDto);
  }
  @Get("/selection")
  selection() {
    return this.userService.selection();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }
}
