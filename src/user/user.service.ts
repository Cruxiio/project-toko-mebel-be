import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/create-user.dto';
// import { UserRepository } from './user.repository';
import { compare, hash } from 'bcryptjs';
import { UserRepository } from 'src/database/mongodb/repositories/user.repository';
import { UserDeleteResponse } from './dto/response.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handleFindOneUser(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    return await this.userRepository.findOne({ id });
  }

  async handleFindAllUser() {
    return await this.userRepository.findAll({});
  }

  async handleCreateUser(createUserDto: CreateUserDto) {
    // cek username sudah ada atau belum
    let kembar = await this.userRepository.validateUserUniqueField({
      username: createUserDto.username,
      deleted_at: null,
    });

    if (kembar) {
      throw new BadRequestException('Username already exists');
    }

    // cek email sudah ada atau belum
    kembar = await this.userRepository.validateUserUniqueField({
      email: createUserDto.email,
      deleted_at: null,
    });

    if (kembar) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
  }

  async handleUpdateUser(id: number, updateUserDto: UpdateUserDto) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    const updatedUser = await this.userRepository.update(
      { id, deleted_at: null },
      { ...updateUserDto },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async handleResetUserCollectionAutoInc() {
    await this.userRepository.resetAutoIncrement('user_id_counter');
  }

  async handleDeleteUser(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    const deletedUser = await this.userRepository.update(
      { id, deleted_at: null },
      { deleted_at: new Date() },
    );

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    const res: UserDeleteResponse = {
      message: 'OK',
    };

    return res;
  }

  // GENERIC FUNCTION

  // Used for checking if the user is superadmin or not
  async handleCekRole(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    const currUser = await this.handleFindOneUser(id);

    if (currUser.role == 'superadmin') {
      throw new BadRequestException(
        'Cannot update role / delete user with superadmin role',
      );
    }
  }

  async handleUpdateUserPassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    // minta data user berdasarkan id
    const currUser = await this.handleFindOneUser(id);

    if (updatePasswordDto.old_password != '') {
      // cek apakah password lama benar

      const autheticated = await compare(
        updatePasswordDto.old_password,
        currUser.password,
      );

      if (!autheticated) {
        throw new BadRequestException('Old password is incorrect');
      }
    }

    await this.userRepository.update(
      { id, deleted_at: null },
      { password: await hash(updatePasswordDto.new_password, 10) },
    );

    const res: UserDeleteResponse = { message: 'OK' };

    return res;
  }
}
