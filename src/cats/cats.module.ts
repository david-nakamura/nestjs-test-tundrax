import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cats } from './entities/cats.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cats]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [CatsController,],
  providers: [
    CatsService,
    UserService
  ]
})
export class CatsModule {}
