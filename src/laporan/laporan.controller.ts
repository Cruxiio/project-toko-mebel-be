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

  @Post('hpp-kayu')
  create(@Body() createLaporanDto: CreateLaporanHPPDto) {
    return this.laporanService.laporanHPPKayu(createLaporanDto);
  }

  @Get()
  findAll() {
    return this.laporanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laporanService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laporanService.remove(+id);
  }
}
