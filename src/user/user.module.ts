import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserRepository } from 'src/database/mongodb/repositories/user.repository';
import { MongoDBProvider } from 'src/database/mongodb/mongodb.providers';

@Module({
  imports: [
    // kasih tau mongoose schema mana yang mau diimport
    MongoDBProvider,
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
