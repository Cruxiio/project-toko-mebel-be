import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
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

@Controller('api/proyek')
export class ProyekController {
  constructor(private readonly proyekService: ProyekService) {}

  @Post()
  createProyek(@Body() createProyekDto: CreateProyekDto) {
    return this.proyekService.handleCreateProyek(createProyekDto);
  }

  @Post('produk')
  createProyekProduk(@Body() createProyekProdukDto: CreateProyekProdukDto) {
    return this.proyekService.handleCreateProyekProduk(createProyekProdukDto);
  }

  @Get()
  findAll(@Query() query: FindAllProyekDto) {
    return this.proyekService.handleFindAllProyek(query);
  }

  @Get('produk')
  findAllProyekProduk(@Query() query: FindAllProyekProdukDto) {
    return this.proyekService.handleFindAllProyekProduk(query);
  }

  @Get(':id')
  findOneProyek(@Param('id') id: number) {
    return this.proyekService.handleFindOneProyek(id);
  }

  @Put(':id')
  updateProyek(
    @Param('id') id: number,
    @Body() updateProyekDto: UpdateProyekDto,
  ) {
    return this.proyekService.handleUpdateProyek(id, updateProyekDto);
  }

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

  @Delete(':id')
  deleteProyek(@Param('id') id: number) {
    return this.proyekService.handleDeleteProyek(id);
  }

  @Delete(':id/produk')
  deleteProyekProduk(@Param('id') id: number) {
    return this.proyekService.handleDeleteProyekProduk(id);
  }
}
