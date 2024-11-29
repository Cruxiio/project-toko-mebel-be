import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';
import { UserRepository } from 'src/database/mongodb/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handleFindOneUser(id: number) {
    return await this.userRepository.findOne({ id });
  }

  async handleFindAllUser() {
    return await this.userRepository.findAll({});
  }

  async handleCreateUser(createUserDto: CreateUserDto) {
    // cek username sudah ada atau belum
    const kembar = await this.userRepository.validateUserUniqueField({
      username: createUserDto.username,
    });

    if (kembar) {
      throw new BadRequestException('Username already exists');
    }

    return await this.userRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });
  }

  async handleUpdateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id }, { ...updateUserDto });
  }

  async handleResetUserCollectionAutoInc() {
    await this.userRepository.resetAutoIncrement('user_id_counter');
  }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
