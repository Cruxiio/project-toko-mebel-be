import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryMasukDto } from './create-history-masuk.dto';

export class UpdateHistoryMasukDto extends PartialType(CreateHistoryMasukDto) {}
