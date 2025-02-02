import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  FindAllCustomerDto,
  UpdateCustomerDto,
} from './dto/customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/custom_decorator/role.decorator';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('api/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Roles('superadmin')
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.HandleCreateCustomer(createCustomerDto);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get()
  findAll(@Query() requestFilter: FindAllCustomerDto) {
    return this.customerService.HandleFindAllCustomer(requestFilter);
  }

  @Roles('superadmin', 'adminworkshop')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customerService.HandleFindOneCustomer(id);
  }

  @Roles('superadmin')
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.HandleUpdateCustomer(id, updateCustomerDto);
  }

  @Roles('superadmin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.customerService.HandleDeleteCustomer(id);
  }
}
