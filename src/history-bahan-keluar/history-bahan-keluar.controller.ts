import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';
import {
  CreateHistoryBahanKeluarDto,
  UpdateHistoryBahanKeluarDto,
} from './dto/create-history-bahan-keluar.dto';

@Controller('api/history-bahan-keluar')
export class HistoryBahanKeluarController {
  constructor(
    private readonly historyBahanKeluarService: HistoryBahanKeluarService,
  ) {}

  @Post()
  create(@Body() createHistoryBahanKeluarDto: CreateHistoryBahanKeluarDto) {
    return this.historyBahanKeluarService.HandleCreateHistoryBahanKeluar(
      createHistoryBahanKeluarDto,
    );
  }

  @Get()
  findAll() {
    return this.historyBahanKeluarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyBahanKeluarService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoryBahanKeluarDto: UpdateHistoryBahanKeluarDto,
  ) {
    return this.historyBahanKeluarService.update(
      +id,
      updateHistoryBahanKeluarDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyBahanKeluarService.remove(+id);
  }
}
