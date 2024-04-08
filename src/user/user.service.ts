import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { configService } from 'src/config/config.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    // Registers a new user
    async register(user: RegisterUserDto) {
        // Checks if the email is already in use
        const isExist = await this.getUserByEmail(user.email);
        if (isExist) {
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }
        // Generates a salt for password hashing
        const salt = await genSaltSync(10);

        // Creates a new user entity and saves it to the database
        const newUser = await this.userRepository.save({
            name: user.name,
            email: user.email,
            role: 'user',
            password: hashSync(user.password, salt), // Hashes the password before saving
            favoriteCats: [] // Initializes favoriteCats array
        });
        return newUser;
    }

    // Authenticates a user and generates JWT token
    async login(user: LoginUserDto) {
        // Retrieves user from the database based on email
        const currentUser = await this.getUserByEmail(user.email);
        // If user doesn't exist, throws an exception
        if (!currentUser) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
        }
        // Compares the provided password with the hashed password stored in the database
        const isMatch = await compareSync(user.password, currentUser.password);
        // If passwords don't match, throws an exception
        if (!isMatch) {
            throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
        }
        
        // Generates JWT token for authenticated user
        const token = await this.signToken(currentUser);

        // Extracts relevant user information to return with the token
        const { id, email, role } = currentUser;

        return {
            token: token,
            user: {
                id, email, role
            }
        }
    }

    // Signs JWT token
    async signToken(user) {
        // Retrieves private key for signing JWT token
        const privateKey = configService.getPrivateKey();
        // Constructs payload for JWT token
        const payload = {
            email: user.email,
            id: user.id,
            role: user.role
        };
    
        // Signs and returns the JWT token
        return await this.jwtService.sign(payload, { privateKey });
    }

    // Retrieves user by email
    async getUserByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email }});
    }
}
