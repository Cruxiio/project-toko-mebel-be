import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMasterDto {}

export class MasterFindAllStokDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_proyek_produk must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_proyek_produk?: number = 0;
}
