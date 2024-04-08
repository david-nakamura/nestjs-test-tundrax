import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { configService } from 'src/config/config.service';



@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: configService.getPrivateKey(),
            signOptions: { expiresIn: '2 days' },
        }),
    ],
    controllers: [
        UserController
    ],
    providers: [
        UserService,
    ]
})
export class UserModule {}
