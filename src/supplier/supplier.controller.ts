import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  CreateSupplierDto,
  FindAllSupplierDto,
  UpdateSupplierDto,
} from './dto/supplier_request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Roles('superadmin')
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.HandleCreateSupplier(createSupplierDto);
  }

  @Roles('superadmin')
  @Get()
  findAll(@Query() requestFilter: FindAllSupplierDto) {
    return this.supplierService.HandleFindAllSupplier(requestFilter);
  }

  @Roles('superadmin')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.supplierService.HandleFindOneSupplier(id);
  }

  @Roles('superadmin')
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.HandleUpdateSupplier(id, updateSupplierDto);
  }

  @Roles('superadmin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.supplierService.HandleDeleteSupplier(id);
  }
}
