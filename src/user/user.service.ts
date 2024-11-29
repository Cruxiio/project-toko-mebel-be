import { Injectable } from '@nestjs/common';
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
