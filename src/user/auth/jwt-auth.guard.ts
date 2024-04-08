import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
    HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { configService } from 'src/config/config.service';

@Injectable()
export class JWTAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    // Function to determine if the request is authorized based on the presence and validity of a JWT token
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Extract the request object from the execution context
        const request = context.switchToHttp().getRequest();
        // Extract the JWT token from the request header
        const token = this.extractTokenFromHeader(request);
        
        // If no token is provided, deny access and throw an unauthorized exception
        if (!token) {
            throw new HttpException('Please login', HttpStatus.UNAUTHORIZED);
        }
        // Retrieve the private key used to sign the JWT tokens
        const privateKey = configService.getPrivateKey();
        try {
            // Verify the JWT token and extract the payload
            const payload = await this.jwtService.verifyAsync(token, { secret: privateKey });
            // Attach the user payload to the request object
            request['user'] = payload;
        } catch {
            // If token verification fails, deny access and throw an unauthorized exception
            throw new HttpException('Token has been expired', HttpStatus.UNAUTHORIZED);
        }
        // Allow access if the token is present and valid
        return true;
    }

    // Function to extract the JWT token from the authorization header
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
