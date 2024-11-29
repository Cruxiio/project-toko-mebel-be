import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    // console.log(req.user);

    return this.userService.handleFindAllUser();
  }

  @Delete('reset')
  resetAutoIncrement() {
    this.userService.handleResetUserCollectionAutoInc();
    return {
      message: 'Auto increment has been reset',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.handleFindOneUser(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.handleCreateUser(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.handleUpdateUser(+id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
