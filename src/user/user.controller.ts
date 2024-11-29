import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('superadmin', 'admin')
  @Get()
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

  @Roles('superadmin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.handleCreateUser(createUserDto);
  }

  @Roles('superadmin')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.handleUpdateUser(+id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
