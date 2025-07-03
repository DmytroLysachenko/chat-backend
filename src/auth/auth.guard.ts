import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from './jwt-payload.interface';
import { AuthenticatedSocket } from './authenticated-socket.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: AuthenticatedSocket = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      client.handshake.auth.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
