import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../decorators/roles.decorator';
import { configService } from 'src/config/config.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  // Function to determine if the user possesses the required role to access the resource
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the role specified in the decorator
    const role = this.reflector.get(Roles, context.getHandler());
    // If no role is specified, access is granted by default
    if (!role) {
      return true;
    }
    
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

    // Retrieve the user payload from the request object
    const user = request.user;
    
    // Function to check if the user possesses the required role
    const roleCheck = () => {
      if (user.role === role) {
        return true;
      } else {
        return false;
      }
    }

    // Grant access if the user is defined, has a role, and possesses the required role
    return user && user.role && roleCheck();
  }

  // Function to extract the JWT token from the authorization header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
