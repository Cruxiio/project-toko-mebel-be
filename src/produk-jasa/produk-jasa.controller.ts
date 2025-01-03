import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProdukJasaService } from './produk-jasa.service';
import {
  CreateProdukJasaDto,
  FindAllProdukJasaDto,
} from './dto/create-produk-jasa.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/produk-jasa')
export class ProdukJasaController {
  constructor(private readonly produkJasaService: ProdukJasaService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createProdukJasaDto: CreateProdukJasaDto) {
    return this.produkJasaService.handleCreateProdukJasa(createProdukJasaDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() requestFilter: FindAllProdukJasaDto) {
    return this.produkJasaService.handleFindAllProdukJasa(requestFilter);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produkJasaService.handleDeleteProdukJasa(id);
  }
}
