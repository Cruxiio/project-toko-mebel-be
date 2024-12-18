import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto } from './dto/create-produk.dto';

@Controller('api/produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  create(@Body() createProdukDto: CreateProdukDto) {
    return this.produkService.handleCreateProduk(createProdukDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.produkService.handleFindOneProduk(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProdukDto: UpdateProdukDto) {
    return this.produkService.handleUpdateProduk(id, updateProdukDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produkService.handleRemoveProduk(id);
  }
}
