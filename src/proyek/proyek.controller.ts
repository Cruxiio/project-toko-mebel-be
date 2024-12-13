import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ProyekService } from './proyek.service';
import {
  CreateProyekDto,
  FindAllProyekDto,
  UpdateProyekDto,
} from './dto/create-proyek.dto';

@Controller('api/proyek')
export class ProyekController {
  constructor(private readonly proyekService: ProyekService) {}

  @Post()
  createProyek(@Body() createProyekDto: CreateProyekDto) {
    return this.proyekService.handleCreateProyek(createProyekDto);
  }

  @Get()
  findAll(@Query() query: FindAllProyekDto) {
    return this.proyekService.handleFindAllProyek(query);
  }

  @Get(':id')
  findOneProyek(@Param('id') id: number) {
    return this.proyekService.handleFindOneProyek(id);
  }

  @Put(':id')
  updateProyek(
    @Param('id') id: number,
    @Body() updateProyekDto: UpdateProyekDto,
  ) {
    return this.proyekService.handleUpdateProyek(id, updateProyekDto);
  }

  @Delete(':id')
  deleteProyek(@Param('id') id: number) {
    return this.proyekService.handleDeleteProyek(id);
  }
}
