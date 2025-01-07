import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotaService } from './nota.service';
import {
  CreateNotaDto,
  FindAllNotaDto,
  UpdateNotaDto,
} from './dto/create-nota.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/nota')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Roles('superadmin', 'adminkantor')
  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notaService.handleCreateNota(createNotaDto);
  }

  @Roles('superadmin', 'adminkantor')
  @Get()
  findAll(@Query() query: FindAllNotaDto) {
    return this.notaService.handleFindAllNota(query);
  }

  @Roles('superadmin', 'adminkantor')
  @Get('laporan')
  laporanNota(@Query() query: FindAllNotaDto) {
    return this.notaService.handleLaporanNota(query);
  }

  @Roles('superadmin', 'adminkantor')
  @Get('kode-nota-pembelian/:id')
  findOneByKodeNota(@Param('id') id: number) {
    return this.notaService.handleFindOneNotaByHistoryBahanMasukID(id);
  }

  @Roles('superadmin', 'adminkantor')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notaService.handleFindOneNota(id);
  }

  @Roles('superadmin', 'adminkantor')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateNotaDto: UpdateNotaDto) {
    return this.notaService.handleUpdateNota(id, updateNotaDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notaService.remove(+id);
  // }
}
