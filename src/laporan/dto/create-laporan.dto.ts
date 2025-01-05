import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateLaporanHPPDto {
  @IsString()
  @IsNotEmpty({ message: 'jenis_proyek is required' })
  jenis_proyek: string;

  @IsString()
  @IsNotEmpty({ message: 'sj_no is required' })
  sj_no: string;

  @IsString()
  @IsNotEmpty({ message: 'acc is required' })
  acc: string;

  @IsString()
  @IsNotEmpty({ message: 'marketing is required' })
  marketing: string;

  @IsString()
  @IsNotEmpty({ message: 'nama_penanggung_jawab is required' })
  nama_penanggung_jawab: string;

  @IsNumber({}, { message: 'total_harian must be a number' })
  @IsNotEmpty({ message: 'total_harian is required' })
  @Min(0, { message: 'total_harian must be a positive number' })
  @Transform(({ value }) => Number(value))
  total_harian: number;

  @IsNumber({}, { message: 'total_borongan must be a number' })
  @IsNotEmpty({ message: 'total_borongan is required' })
  @Min(0, { message: 'total_borongan must be a positive number' })
  @Transform(({ value }) => Number(value))
  total_borongan: number;

  @IsNumber({}, { message: 'id_proyek_produk must be a number' })
  @IsNotEmpty({ message: 'id_proyek_produk is required' })
  @Transform(({ value }) => Number(value))
  id_proyek_produk: number;
}
