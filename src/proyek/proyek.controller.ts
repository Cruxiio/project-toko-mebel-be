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
import { ProyekService } from './proyek.service';
import {
  CreateProyekDto,
  CreateProyekProdukDto,
  FindAllProyekDto,
  FindAllProyekProdukDto,
  UpdateProyekDto,
  UpdateProyekProdukDto,
} from './dto/create-proyek.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/proyek')
export class ProyekController {
  constructor(private readonly proyekService: ProyekService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  createProyek(@Body() createProyekDto: CreateProyekDto) {
    return this.proyekService.handleCreateProyek(createProyekDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Post('produk')
  createProyekProduk(@Body() createProyekProdukDto: CreateProyekProdukDto) {
    return this.proyekService.handleCreateProyekProduk(createProyekProdukDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() query: FindAllProyekDto) {
    return this.proyekService.handleFindAllProyek(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get('produk')
  findAllProyekProduk(@Query() query: FindAllProyekProdukDto) {
    return this.proyekService.handleFindAllProyekProduk(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOneProyek(@Param('id') id: number) {
    return this.proyekService.handleFindOneProyek(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  updateProyek(
    @Param('id') id: number,
    @Body() updateProyekDto: UpdateProyekDto,
  ) {
    return this.proyekService.handleUpdateProyek(id, updateProyekDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id/produk/:id_proyek_produk')
  updateProyekProduk(
    @Param('id') id: number,
    @Param('id_proyek_produk') id_proyek_produk: number,
    @Body() updateProyekProdukDto: UpdateProyekProdukDto,
  ) {
    return this.proyekService.handleUpdateProyekProduk(
      id,
      id_proyek_produk,
      updateProyekProdukDto,
    );
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  deleteProyek(@Param('id') id: number) {
    return this.proyekService.handleDeleteProyek(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id/produk')
  deleteProyekProduk(@Param('id') id: number) {
    return this.proyekService.handleDeleteProyekProduk(id);
  }
}
