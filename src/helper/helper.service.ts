import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  cekUnique(ids: number[]): boolean {
    const uniqueIds = new Set(ids);
    return uniqueIds.size == ids.length;
  }
}
