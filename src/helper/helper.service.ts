import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  cekUnique(ids: number[]): boolean {
    const uniqueIds = new Set(ids);
    return uniqueIds.size == ids.length;
  }

  formatDatetoString(date: Date): string {
    const moment = require('moment');
    return moment(date).format('YYYY-MM-DD');
  }
}
