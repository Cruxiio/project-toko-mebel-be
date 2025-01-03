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
import { BahanSisaService } from './bahan-sisa.service';
import {
  CreateBahanSisaDto,
  FindAllBahanSisaDto,
  UpdateBahanSisaDto,
} from './dto/create-bahan-sisa.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/bahan-sisa')
export class BahanSisaController {
  constructor(private readonly bahanSisaService: BahanSisaService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createBahanSisaDto: CreateBahanSisaDto) {
    return this.bahanSisaService.handleCreateBahanSisa(createBahanSisaDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() requestFilter: FindAllBahanSisaDto) {
    return this.bahanSisaService.handleFindAllBahanSisa(requestFilter);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateBahanSisaDto: UpdateBahanSisaDto,
  ) {
    return this.bahanSisaService.handleUpdateBahanSisa(id, updateBahanSisaDto);
  }
}
