import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    CoreModule, 
    CatsModule,
    UserModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig())
  ],
})
export class AppModule {}
