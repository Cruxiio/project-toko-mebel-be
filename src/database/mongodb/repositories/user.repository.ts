import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
// import * as mongoose from 'mongoose';
// mongoose.set('debug', true);

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /*
    NOTE: ini sebenarnya func CRUD bisa diabtraksi, coba cari tau lebih lanjut tentang cara proses abstraksinya gimana
  */

  // repo itu anggapannya sama seperti manager

  /* FUNC CRUD generic */

  //filterQuery itu adalah query yang akan dijalankan di database
  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    const userData = await this.userModel.findOne(userFilterQuery);
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }

  async findAll(userFilterQuery: FilterQuery<User>): Promise<User[]> {
    return await this.userModel.find(userFilterQuery);
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      // create a model user baru
      const newUser = new this.userModel(user);
      // simpan model nya
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(
    userFilterQuery: FilterQuery<User>,
    updatedField: Partial<User>,
  ): Promise<User> {
    // param {new: true} adalah untuk memastikan data yang dikembalikan merupakan data yang sudah diupdate
    return await this.userModel.findOneAndUpdate(
      userFilterQuery,
      updatedField,
      {
        new: true,
      },
    );
  }

  // Fungsi untuk mereset auto-increment
  async resetAutoIncrement(fieldName: string) {
    const CounterModel = this.userModel.db.collection('counters');
    await CounterModel.deleteOne({ id: fieldName as any });
    await this.userModel.deleteMany({});
  }

  /*FUNC NON CRUD*/

  async validateUserUniqueField(
    userField: FilterQuery<User>,
  ): Promise<boolean> {
    const user = await this.userModel.findOne(userField);
    return user ? true : false;
  }
}
