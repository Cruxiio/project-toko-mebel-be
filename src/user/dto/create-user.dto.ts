import { PartialType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'nama is required' })
  nama: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
    {
      message:
        'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&_).',
    },
  )
  password: string;

  @IsString({})
  @IsIn(
    [
      // 'superadmin',
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
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message:
      'Email must include @ and domain (.) and domain must be at least 2 characters long',
  })
  email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsIn(
    ['adminkantor', 'karyawankantor', 'adminworkshop', 'karyawanworkshop'],
    { message: 'Role harus salah satu dari role yang disediakan' },
  )
  @IsOptional()
  role?: string;
}

export class AdminUpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'new_password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
    {
      message:
        'new_password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&_).',
    },
  )
  new_password: string;
}

export class UpdatePasswordDto extends AdminUpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'old_password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
    {
      message:
        'old_password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&_).',
    },
  )
  old_password: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8, { message: 'new_password must be at least 8 characters long.' })
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]+$/,
  //   {
  //     message:
  //       'new_password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&_).',
  //   },
  // )
  // new_password: string;
}
