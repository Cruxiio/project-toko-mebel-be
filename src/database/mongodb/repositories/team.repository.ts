import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Team, TeamDocument } from '../schemas/team.schema';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async findOne(teamFilterQuery: FilterQuery<Team>) {
    const teamData = await this.teamModel.findOne(teamFilterQuery);
    return teamData;
  }

  async findAll(
    teamFilterQuery: FilterQuery<Team>,
    paginationQuery: any,
    showedField: any,
  ) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Team> = { deleted_at: null };

    if (teamFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: teamFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    // ini untuk paginationnya
    const { page, per_page } = paginationQuery;
    // skip untuk mulai dari data ke berapa (mirip OFFSET pada SQL)
    const skip = (page - 1) * per_page;

    return await this.teamModel
      .find(filter, showedField)
      .skip(skip)
      .limit(per_page);
  }

  // ini buat dapetin seluruh jumlah data berdasarkan syarat filter
  async countAll(teamFilterQuery: FilterQuery<Team>) {
    // buat temporary object untuk isi filter sesuai syarat yang diberikan
    let filter: FilterQuery<Team> = { deleted_at: null };

    if (teamFilterQuery.nama != '') {
      filter = {
        ...filter,
        nama: {
          $regex: teamFilterQuery.nama, // like isi regex
          $options: 'i', // i artinya case-insensitive
        },
      };
    }

    return await this.teamModel.countDocuments(filter);
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
}
