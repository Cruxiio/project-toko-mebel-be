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

  async findAllPagination(
    userFilterQuery: FilterQuery<User>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<User> = {
      deleted_at: null,
      role: { $ne: 'superadmin' },
    };

    if (userFilterQuery.nama != '') {
      filter = {
        ...filter,
        $or: [
          {
            nama: {
              $regex: userFilterQuery.nama, // like isi regex
              $options: 'i', // i artinya case-insensitive
            },
          },
          {
            username: {
              $regex: userFilterQuery.nama, // like isi regex
              $options: 'i', // i artinya case-insensitive
            },
          },
        ],
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.userModel
      .find(filter, showedField)
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAllPagination(userFilterQuery: FilterQuery<User>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<User> = { deleted_at: null };

    if (userFilterQuery.nama != '') {
      filter = {
        ...filter,
        $or: [
          {
            nama: {
              $regex: userFilterQuery.nama, // like isi regex
              $options: 'i', // i artinya case-insensitive
            },
          },
          {
            username: {
              $regex: userFilterQuery.nama, // like isi regex
              $options: 'i', // i artinya case-insensitive
            },
          },
        ],
      };
    }

    return await this.userModel.countDocuments(filter);
  }
}
