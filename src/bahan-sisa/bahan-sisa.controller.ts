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
} from '@nestjs/common';
import { BahanSisaService } from './bahan-sisa.service';
import {
  CreateBahanSisaDto,
  FindAllBahanSisaDto,
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
  findAll(@Query() requestFilter: FindAllBahanSisaDto) {
    return this.bahanSisaService.handleFindAllBahanSisa(requestFilter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bahanSisaService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateBahanSisaDto: UpdateBahanSisaDto,
  ) {
    return this.bahanSisaService.handleUpdateBahanSisa(id, updateBahanSisaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bahanSisaService.remove(+id);
  }
}
