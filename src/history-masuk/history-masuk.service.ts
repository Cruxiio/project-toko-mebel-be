import { Injectable } from '@nestjs/common';
import {
  CreateHistoryMasukDto,
  UpdateHistoryMasukDto,
} from './dto/create-history-masuk.dto';
import {} from './dto/response.interface';
import { HistoryBahanMasukRepository } from 'src/database/mongodb/repositories/historyBahanMasuk.repository';

@Injectable()
export class HistoryMasukService {
  constructor(
    private readonly historyBahanMasukRepo: HistoryBahanMasukRepository,
  ) {}
  create(createHistoryMasukDto: CreateHistoryMasukDto) {
    return 'This action adds a new historyMasuk';
  }

  findAll() {
    return `This action returns all historyMasuk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historyMasuk`;
  }

  update(id: number, updateHistoryMasukDto: UpdateHistoryMasukDto) {
    return `This action updates a #${id} historyMasuk`;
  }

  remove(id: number) {
    return `This action removes a #${id} historyMasuk`;
  }
}
