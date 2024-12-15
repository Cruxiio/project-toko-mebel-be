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
import { KaryawanService } from './karyawan.service';
import {
  CreateKaryawanDto,
  FindAllKaryawanDto,
  UpdateKaryawanDto,
} from './dto/create-karyawan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/karyawan')
export class KaryawanController {
  constructor(private readonly karyawanService: KaryawanService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createKaryawanDto: CreateKaryawanDto) {
    return this.karyawanService.handleCreateKaryawan(createKaryawanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() query: FindAllKaryawanDto) {
    return this.karyawanService.handleFindAllKaryawan(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.karyawanService.handleFindOneKaryawan(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateKaryawanDto: UpdateKaryawanDto,
  ) {
    return this.karyawanService.handleUpdateKaryawan(id, updateKaryawanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.karyawanService.hanldeDeleteKaryawan(id);
  }
}
