import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';
import {
  CreateHistoryBahanKeluarDto,
  FindAllHistoryBahanKeluarDto,
  LaporanStokBahanKeluarDto,
  UpdateHistoryBahanKeluarDto,
} from './dto/create-history-bahan-keluar.dto';

@Controller('api/history-bahan-keluar')
export class HistoryBahanKeluarController {
  constructor(
    private readonly historyBahanKeluarService: HistoryBahanKeluarService,
  ) {}

  @Post()
  create(@Body() createHistoryBahanKeluarDto: CreateHistoryBahanKeluarDto) {
    return this.historyBahanKeluarService.handleCreateHistoryBahanKeluar(
      createHistoryBahanKeluarDto,
    );
  }

  @Get()
  findAll(@Query() requestFilter: FindAllHistoryBahanKeluarDto) {
    return this.historyBahanKeluarService.handleFindAllHistoryBahanKeluar(
      requestFilter,
    );
  }

  @Get('laporan')
  getLaporan(@Query() requestFilter: LaporanStokBahanKeluarDto) {
    return this.historyBahanKeluarService.handleLaporanStokBahanKeluar(
      requestFilter,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.historyBahanKeluarService.handleFindOneHistoryBahanKeluar(id);
  }
}
