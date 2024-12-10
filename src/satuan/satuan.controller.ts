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
import { SatuanService } from './satuan.service';
import {
  CreateSatuanDto,
  FindAllSatuanDto,
  UpdateSatuanDto,
} from './dto/satuan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/satuan')
export class SatuanController {
  constructor(private readonly satuanService: SatuanService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createSatuanDto: CreateSatuanDto) {
    return this.satuanService.HandleCreateSatuan(createSatuanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() query: FindAllSatuanDto) {
    return this.satuanService.HandleFindAllSatuan(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.satuanService.HandleFindOneSatuan(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateSatuanDto: UpdateSatuanDto) {
    return this.satuanService.HandleUpdateSatuan(id, updateSatuanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.satuanService.HandleDeleteSatuan(id);
  }
}
