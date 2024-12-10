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
  UseGuards,
} from '@nestjs/common';
import { HistoryMasukService } from './history-masuk.service';
import {
  CreateHistoryMasukDto,
  FindAllStokDto,
  FindAllHistoryMasukDto,
  UpdateHistoryMasukDto,
} from './dto/create-history-masuk.dto';
import {} from './dto/response.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/history-bahan-masuk')
export class HistoryMasukController {
  constructor(private readonly historyMasukService: HistoryMasukService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createHistoryMasukDto: CreateHistoryMasukDto) {
    return this.historyMasukService.HandleCreateHistoryBahanMasuk(
      createHistoryMasukDto,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() query: FindAllHistoryMasukDto) {
    return this.historyMasukService.HandleFindAllHistoryBahanMasuk(query);
  }

  @Roles('superadmin', 'adminworkshop')
  // ini buat dapetin semua detail history masuk untuk stok bahan saat ini
  @Get('stok')
  findAllDetailBahanMasuk(@Query() query: FindAllStokDto) {
    return this.historyMasukService.HandleFindAllStok(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get('stok/laporan')
  getLaporan(@Query() query: FindAllStokDto) {
    return this.historyMasukService.HandleLaporanStokBahanMasuk(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.historyMasukService.HandleFindOneHistoryBahanMasuk(id);
  }

  @Roles('superadmin', 'adminworkshop')
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
