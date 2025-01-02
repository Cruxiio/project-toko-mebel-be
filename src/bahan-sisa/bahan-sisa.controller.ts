import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BahanSisaService } from './bahan-sisa.service';
import {
  CreateBahanSisaDto,
  UpdateBahanSisaDto,
} from './dto/create-bahan-sisa.dto';

@Controller('api/bahan-sisa')
export class BahanSisaController {
  constructor(private readonly bahanSisaService: BahanSisaService) {}

  @Post()
  create(@Body() createBahanSisaDto: CreateBahanSisaDto) {
    return this.bahanSisaService.handleCreateBahanSisa(createBahanSisaDto);
  }

  @Get()
  findAll() {
    return this.bahanSisaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bahanSisaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBahanSisaDto: UpdateBahanSisaDto,
  ) {
    return this.bahanSisaService.update(+id, updateBahanSisaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bahanSisaService.remove(+id);
  }
}
