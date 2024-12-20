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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  AdminUpdateUserPasswordDto,
  CreateUserDto,
  FindAllUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // user profile biasa
  @Roles(
    'superadmin',
    'adminkantor',
    'karyawankantor',
    'adminworkshop',
    'karyawanworkshop',
  )
  @Put('profile')
  updateUserData(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.handleUpdateUser(req.user.id, {
      nama: updateUserDto.nama,
    });
  }

  @Roles(
    'superadmin',
    'adminkantor',
    'karyawankantor',
    'adminworkshop',
    'karyawanworkshop',
  )
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.userService.handleFindOneUser(req.user.id);
  }

  @Roles(
    'superadmin',
    'adminkantor',
    'karyawankantor',
    'adminworkshop',
    'karyawanworkshop',
  )
  @Put('profile/password')
  updatePassword(
    @Request() req: any,
    @Body() updateUserPasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.handleUpdateUserPassword(req.user.id, {
      old_password: updateUserPasswordDto.old_password,
      new_password: updateUserPasswordDto.new_password,
    });
  }

  // manage user for superadmin
  @Roles('superadmin')
  @Get()
  async findAll(@Query() userFilter: FindAllUserDto) {
    return this.userService.handleFindAllUser(userFilter);
  }

  @Roles('superadmin')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.handleFindOneUser(id);
  }

  @Roles('superadmin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.handleCreateUser(createUserDto);
  }

  @Roles('superadmin')
  @Put(':id/role')
  async updateRole(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // cek user yang rolenya diupdate tdk boleh user dengan role superadmin
    await this.userService.handleCekRole(id);

    return await this.userService.handleUpdateUser(id, {
      role: updateUserDto.role,
    });
  }

  @Roles('superadmin')
  @Put(':id/password')
  async updateUserPassword(
    @Param('id') id: number,
    @Body() updateUserPasswordDto: AdminUpdateUserPasswordDto,
  ) {
    // cek user yang rolenya diupdate tdk boleh user dengan role superadmin
    await this.userService.handleCekRole(id);

    return this.userService.handleUpdateUserPassword(id, {
      old_password: '',
      new_password: updateUserPasswordDto.new_password,
    });
  }

  @Roles('superadmin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    // cek user yang rolenya didelete tdk boleh user dengan role superadmin
    await this.userService.handleCekRole(id);

    return await this.userService.handleDeleteUser(id);
  }

  @Delete('reset')
  resetAutoIncrement() {
    this.userService.handleResetUserCollectionAutoInc();
    return {
      message: 'Auto increment has been reset',
    };
  }
}
