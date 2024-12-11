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
import { NotaService } from './nota.service';
import {
  CreateNotaDto,
  FindAllNotaDto,
  UpdateNotaDto,
} from './dto/create-nota.dto';

@Controller('api/nota')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notaService.handleCreateNota(createNotaDto);
  }

  @Get()
  findAll(@Query() query: FindAllNotaDto) {
    return this.notaService.handleFindAllNota(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notaService.handleFindOneNota(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateNotaDto: UpdateNotaDto) {
    return this.notaService.handleUpdateNota(id, updateNotaDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notaService.remove(+id);
  // }
}
