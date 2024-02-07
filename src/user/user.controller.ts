import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }
  @Post("/insert")
  insert(@Body() createDto: CreateUserDto) {
    return this.userService.insert(createDto);
  }

  @Get()
  findAll(@Query("search") search: string) {
    return this.userService.findAll(search);
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

  @Put("/edit/:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @Put(":id")
  updateFields(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateChangedFields(+id, updateUserDto);
  }

  @Delete("/remove/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
  @Delete("/delete/:id")
  delete(@Param("id") id: string) {
    return this.userService.delete(+id);
  }
}
