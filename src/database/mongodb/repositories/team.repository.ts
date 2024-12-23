import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Team, TeamDocument } from '../schemas/team.schema';
import { KaryawanRepository } from './karyawan.repository';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
    private readonly karyawanRepo: KaryawanRepository,
  ) {}

  async findOne(teamFilterQuery: FilterQuery<Team>) {
    const teamData = await this.teamModel.findOne(teamFilterQuery);
    return teamData;
  }

  async findAll(teamFilterQuery: FilterQuery<Team>, showedField: any) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Team> = { deleted_at: null };

    // gabungkan filter yang diberikan dengan filter yang ada
    filter = { ...filter, ...teamFilterQuery };

    return await this.teamModel.find(filter, showedField.main).populate({
      path: 'anggota',
      select: showedField.field1,
    });
  }

  async create(teamData: Partial<Team>) {
    try {
      const newKaryawan = new this.teamModel(teamData);
      return await newKaryawan.save();
    } catch (error) {
      console.error('Error creating team:', error);
      throw new Error('Failed to create team');
    }
  }

  async update(teamFilterQuery: FilterQuery<Team>, teamData: Partial<Team>) {
    try {
      const updatedTeam = await this.teamModel.findOneAndUpdate(
        teamFilterQuery,
        teamData,
        { new: true }, // option new: true supaya hasil find one merupakan data setelah diupdate
      );
      return updatedTeam;
    } catch (error) {
      console.error('Error update team:', error);
      throw new Error('Failed to update team');
    }
  }

  async delete(teamFilterQuery: FilterQuery<Team>) {
    return await this.teamModel.deleteOne(teamFilterQuery);
  }

  // FUNC NON-GENERIC

  // async masterFindAll(
  //   karyawanFilterQuery: FilterQuery<Team>,
  //   paginationQuery: any,
  // ) {
  //   return await this.findAll(karyawanFilterQuery, paginationQuery, {
  //     id: 1,
  //     nama: 1,
  //     _id: 0,
  //   });
  // }

  async findAllAnggota(teamFilterQuery: FilterQuery<Team>, showedField: any) {
    const teamData = await this.teamModel
      .findOne(teamFilterQuery, showedField.main)
      .populate({
        path: 'anggota',
        select: showedField.field1,
      });
    return teamData;
  }

  async validateKaryawanIDs(
    arrayKaryawanID: number[],
  ): Promise<Types.ObjectId[]> {
    let result: Types.ObjectId[] = [];

    for (let i = 0; i < arrayKaryawanID.length; i++) {
      const k = arrayKaryawanID[i];

      // cek apakah karyawan ada
      const karyawanData = await this.karyawanRepo.findOne({
        id: k,
        deleted_at: null,
      });

      if (!karyawanData) {
        throw new NotFoundException('Karyawan not found');
      }

      // cek role karyawan pertama apakah ketua atau tidak
      if (karyawanData.role != 'ketua' && i == 0) {
        throw new BadRequestException(
          'Karyawan yang bertanggung jawab harus memiliki role ketua',
        );
      }

      // tambahkan ke result jika valid
      result.push(karyawanData._id as Types.ObjectId);
    }

    return result;
  }
}
