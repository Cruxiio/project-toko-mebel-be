import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto, UpdateProdukDto } from './dto/create-produk.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createProdukDto: CreateProdukDto) {
    return this.produkService.handleCreateProduk(createProdukDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.produkService.handleFindOneProduk(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateProdukDto: UpdateProdukDto) {
    return this.produkService.handleUpdateProduk(id, updateProdukDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produkService.handleRemoveProduk(id);
  }
}
