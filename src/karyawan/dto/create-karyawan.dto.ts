import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateKaryawanDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsString({})
  @IsIn(['ketua', 'member'], {
    message: 'Role harus salah satu dari role yang disediakan',
  })
  @IsNotEmpty({ message: 'role is required' })
  role: string;
}

export class UpdateKaryawanDto extends CreateKaryawanDto {}

export class FindAllKaryawanDto {
  @IsString()
  @IsOptional()
  search?: string = '';

  @ValidateIf((o) => o.role !== '') // Validasi hanya dilakukan ketika role != ''
  @IsString()
  @IsIn(['ketua', 'member'], {
    message: 'Role harus salah satu dari role yang disediakan',
  })
  @IsOptional()
  role?: string = '';

  @IsNumber({}, { message: 'page must be a number' })
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  //transform buat olah value field sebelum masuk ke validasi
  @Transform(({ value }) => Number(value))
  per_page?: number = 10;
}
