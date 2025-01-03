import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HistoryBahanKeluarService } from './history-bahan-keluar.service';
import {
  CreateHistoryBahanKeluarDto,
  FindAllHistoryBahanKeluarDto,
  LaporanStokBahanKeluarDto,
  UpdateHistoryBahanKeluarDto,
} from './dto/create-history-bahan-keluar.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/history-bahan-keluar')
export class HistoryBahanKeluarController {
  constructor(
    private readonly historyBahanKeluarService: HistoryBahanKeluarService,
  ) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createHistoryBahanKeluarDto: CreateHistoryBahanKeluarDto) {
    return this.historyBahanKeluarService.handleCreateHistoryBahanKeluar(
      createHistoryBahanKeluarDto,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() requestFilter: FindAllHistoryBahanKeluarDto) {
    return this.historyBahanKeluarService.handleFindAllHistoryBahanKeluar(
      requestFilter,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Get('laporan')
  getLaporan(@Query() requestFilter: LaporanStokBahanKeluarDto) {
    return this.historyBahanKeluarService.handleLaporanStokBahanKeluar(
      requestFilter,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Get('detail/:id')
  getHistoryKeluarDetail(@Param('id') id: number) {
    return this.historyBahanKeluarService.handleFindOneHistoryBahanKeluarDetail(
      id,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.historyBahanKeluarService.handleFindOneHistoryBahanKeluar(id);
  }
}
