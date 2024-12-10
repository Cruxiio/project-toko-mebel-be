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
import { BahanService } from './bahan.service';
import {
  CreateBahanDto,
  FindAllBahanDto,
  UpdateBahanDto,
} from './dto/bahan.dto';
import {} from './dto/response.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/bahan')
export class BahanController {
  constructor(private readonly bahanService: BahanService) {}

  @Roles('superadmin', 'adminworkshop')
  @Post()
  create(@Body() createBahanDto: CreateBahanDto) {
    return this.bahanService.HandleCreateBahan(createBahanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() query: FindAllBahanDto) {
    return this.bahanService.HandleFindAllBahan(query);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bahanService.HandleFindOneBahan(id);
  }

  @Roles('superadmin', 'adminworkshop')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateBahanDto: UpdateBahanDto) {
    return this.bahanService.HandleUpdateBahan(id, updateBahanDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bahanService.HandleDeleteBahan(id);
  }
}
