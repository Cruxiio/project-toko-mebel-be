import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  FindAllUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/create-user.dto';
// import { UserRepository } from './user.repository';
import { compare, hash } from 'bcryptjs';
import { UserRepository } from 'src/database/mongodb/repositories/user.repository';
import {
  UserDeleteResponse,
  UserFindAllResponse,
  UserFindAllResponseData,
  UserFindOneResponse,
} from './dto/response.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handleFindOneUser(id: number) {
    // cek apakah id adalah int atau bukan
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    let userData = await this.userRepository.findOne({ id, deleted_at: null });

    const res: UserFindOneResponse = {
      id: userData.id,
      nama: userData.nama,
      username: userData.username,
      role: userData.role,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      deleted_at: userData.deleted_at,
    };
    return res;
  }

  async handleFindAllUser(requestFilter: FindAllUserDto) {
    let listUser = await this.userRepository.findAllPagination(
      { nama: requestFilter.search },
      { page: requestFilter.page, per_page: requestFilter.per_page },
      {},
    );

    // filter supaya akun super admin tidak ditampilkan
    // listUser = listUser.filter((u) => u.role != 'superadmin');

    // dapatkan total seluruh data berdasarkan hasil filter
    const totalListDataUser = await this.userRepository.countAllPagination({
      nama: requestFilter.search,
    });

    // hitung total page
    const total_page: number = Math.ceil(
      totalListDataUser / requestFilter.per_page,
    );

    // buat response
    const res: UserFindAllResponse = {
      page: requestFilter.page,
      per_page: requestFilter.per_page,
      data: listUser.map((s) => {
        const formattedData: UserFindAllResponseData = {
          id: s.id,
          nama: s.nama,
          username: s.username,
          role: s.role,
          email: s.email,
          created_at: s.created_at,
          updated_at: s.updated_at,
          deleted_at: s.deleted_at,
        };
        return formattedData;
      }),
      total_page: total_page,
    };

    return res;
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

    let newUser = await this.userRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });

    const res: UserFindOneResponse = {
      id: newUser.id,
      nama: newUser.nama,
      username: newUser.username,
      role: newUser.role,
      email: newUser.email,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      deleted_at: newUser.deleted_at,
    };

    return res;
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

    const res: UserFindOneResponse = {
      nama: updatedUser.nama,
      username: updatedUser.username,
      role: updatedUser.role,
      email: updatedUser.email,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      deleted_at: updatedUser.deleted_at,
    };

    return res;
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
    const currUser = await this.userRepository.findOne({
      id,
      deleted_at: null,
    });

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
