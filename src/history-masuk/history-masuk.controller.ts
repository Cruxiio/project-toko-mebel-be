import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { HistoryMasukService } from './history-masuk.service';
import {
  CreateHistoryMasukDto,
  FindAllStokDto,
  FindAllHistoryMasukDto,
  UpdateHistoryMasukDto,
} from './dto/create-history-masuk.dto';
import {} from './dto/response.interface';

@Controller('api/history-bahan-masuk')
export class HistoryMasukController {
  constructor(private readonly historyMasukService: HistoryMasukService) {}

  @Post()
  create(@Body() createHistoryMasukDto: CreateHistoryMasukDto) {
    return this.historyMasukService.HandleCreateHistoryBahanMasuk(
      createHistoryMasukDto,
    );
  }

  @Get()
  findAll(@Query() query: FindAllHistoryMasukDto) {
    return this.historyMasukService.HandleFindAllHistoryBahanMasuk(query);
  }

  // ini buat dapetin semua detail history masuk untuk stok bahan saat ini
  @Get('stok')
  findAllDetailBahanMasuk(@Query() query: FindAllStokDto) {
    return this.historyMasukService.HandleFindAllStok(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.historyMasukService.HandleFindOneHistoryBahanMasuk(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateHistoryMasukDto: UpdateHistoryMasukDto,
  ) {
    return this.historyMasukService.HandleUpdateHistoryBahanMasuk(
      id,
      updateHistoryMasukDto,
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.historyMasukService.remove(+id);
  // }
}
