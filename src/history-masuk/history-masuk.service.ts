import { Injectable } from '@nestjs/common';
import { CreateHistoryMasukDto } from './dto/create-history-masuk.dto';
import { UpdateHistoryMasukDto } from './dto/update-history-masuk.dto';

@Injectable()
export class HistoryMasukService {
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
