import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistoryMasukService } from './history-masuk.service';
import {
  CreateHistoryMasukDto,
  UpdateHistoryMasukDto,
} from './dto/create-history-masuk.dto';
import {} from './dto/response.interface';

@Controller('history-masuk')
export class HistoryMasukController {
  constructor(private readonly historyMasukService: HistoryMasukService) {}

  @Post()
  create(@Body() createHistoryMasukDto: CreateHistoryMasukDto) {
    return this.historyMasukService.create(createHistoryMasukDto);
  }

  @Get()
  findAll() {
    return this.historyMasukService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historyMasukService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistoryMasukDto: UpdateHistoryMasukDto,
  ) {
    return this.historyMasukService.update(+id, updateHistoryMasukDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyMasukService.remove(+id);
  }
}
