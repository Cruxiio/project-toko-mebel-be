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
import { KaryawanService } from './karyawan.service';
import {
  CreateKaryawanDto,
  FindAllKaryawanDto,
  UpdateKaryawanDto,
} from './dto/create-karyawan.dto';

@Controller('api/karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Post()
  create(@Body() createKaryawanDto: CreateKaryawanDto) {
    return this.karyawanService.handleCreateKaryawan(createKaryawanDto);
  }

  @Get()
  findAll(@Query() query: FindAllKaryawanDto) {
    return this.karyawanService.handleFindAllKaryawan(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.karyawanService.handleFindOneKaryawan(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateKaryawanDto: UpdateKaryawanDto,
  ) {
    return this.karyawanService.handleUpdateKaryawan(id, updateKaryawanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.karyawanService.hanldeDeleteKaryawan(id);
  }
}
