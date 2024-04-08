import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
        try {
            const newUser = await this.userService.register(registerUserDto);
            return res.status(201).json({ user: newUser });
        } catch (error) {
            // Handle error gracefully
            return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
        }
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        try {
            const result = await this.userService.login(loginUserDto);
            return res.status(200).json({ data: result });
        } catch (error) {
            // Handle error gracefully
            return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
        }
    }
}
