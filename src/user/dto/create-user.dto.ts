import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString({})
  @IsIn(
    [
      'superadmin',
      'adminkantor',
      'karyawankantor',
      'adminworkshop',
      'karyawanworkshop',
    ],
    { message: 'Role harus salah satu dari role yang disediakan' },
  )
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
