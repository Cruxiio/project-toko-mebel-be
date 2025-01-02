import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BahanSisa, BahanSisaDocument } from '../schemas/bahan_sisa.schema';
import { FilterQuery, Model } from 'mongoose';
import { BahanSisaInputDatabaseDto } from 'src/bahan-sisa/dto/response.interface';

@Injectable()
export class BahanSisaRepository {
  constructor(
    @InjectModel(BahanSisa.name)
    private readonly bahanSisaModel: Model<BahanSisaDocument>,
  ) {}

  async create(bahanSisaData: BahanSisaInputDatabaseDto) {
    try {
      const newBahanSisa = new this.bahanSisaModel({
        id_history_bahan_keluar_detail:
          bahanSisaData.id_history_bahan_keluar_detail,
        id_satuan: bahanSisaData.id_satuan,
        qty: bahanSisaData.qty,
        keterangan: bahanSisaData.keterangan,
      });
      await newBahanSisa.save();

      return newBahanSisa;
    } catch (error) {
      console.error('Error creating bahan sisa:', error);
      throw new Error('Failed to create bahan sisa');
    }
  }

  async findOne(requestFilter: FilterQuery<BahanSisa>, showField: any) {
    return await this.bahanSisaModel.findOne(requestFilter, showField);
  }
}
