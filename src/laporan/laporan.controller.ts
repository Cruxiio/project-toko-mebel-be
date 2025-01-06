import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { CreateLaporanHPPDto } from './dto/create-laporan.dto';

@Controller('api/laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Post('hpp')
  create(@Body() createLaporanDto: CreateLaporanHPPDto) {
    return this.laporanService.laporanHPPKayu(createLaporanDto);
  }
}
