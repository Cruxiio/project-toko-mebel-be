import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class MasterFindAllStokDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumber({}, { message: 'id_proyek_produk must be a number' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  id_proyek_produk?: number = 0;
}

export class MasterFindAllSatuanDto extends MasterFindAllStokDto {}

export class MasterFindAllKaryawanDto extends MasterFindAllStokDto {
  @ValidateIf((o) => o.role !== '') // Validasi hanya dilakukan ketika role != ''
  @IsString()
  @IsIn(['ketua', 'member'], {
    message: 'Role harus salah satu dari role yang disediakan',
  })
  @IsOptional()
  role?: string = '';
}
