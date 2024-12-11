import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotaService } from './nota.service';
import { CreateNotaDto, UpdateNotaDto } from './dto/create-nota.dto';

@Controller('api/nota')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Post()
  create(@Body() createNotaDto: CreateNotaDto) {
    return this.notaService.handleCreateNota(createNotaDto);
  }

  // @Get()
  // findAll() {
  //   return this.notaService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notaService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNotaDto: UpdateNotaDto) {
  //   return this.notaService.update(+id, updateNotaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notaService.remove(+id);
  // }
}
