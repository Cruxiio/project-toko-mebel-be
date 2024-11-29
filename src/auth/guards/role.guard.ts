import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/*
    NOTE:
    Ini adalah guard untuk memeriksa array role user yang di berikan dari @Roles()
    sesuai dengan role user yang sedang login sekarang.

    Data user yang sedang login di dapat dari req.user hasil populate JwtAuthGuard.

    Guard ini akan di gunakan pada controller yang memerlukan role tertentu

    Example:
    @Controller('users')
    export class UserController {
        constructor(private readonly userService: UserService) {}

        @Get()
        @UseGuards(JwtAuthGuard, RoleGuard)
        @Roles('admin')
        async findAll(@Request() req: any) {
            return this.userService.handleFindAllUser();
        }
    }

    Error response:
    {
        "statusCode": 403,
        "message": "Forbidden access",
        "error": "Forbidden"
    }
*/

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  //  harus ada func canActivate untuk memberitahu apakah proses yang terjadi lolos dari RoleGuard atau tidak
  canActivate(context: ExecutionContext): boolean {
    // ambil data roles dari metadata yang di berikan oleh @Roles() menggunakan reflector
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // jika tidak ada roles, maka tidak ada batasan role untuk akses
    if (!roles) {
      return true;
    }

    // ambil data user dari req.user hasil populate JwtAuthGuard
    const req = context.switchToHttp().getRequest();
    const currUser = req.user;

    // WARNING: includes sifatnya case sensitive
    const authorized = roles.includes(currUser.role);

    if (!authorized) {
      throw new ForbiddenException('Forbidden access');
    }

    return true;
  }
}
