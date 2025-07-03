import { Socket } from 'socket.io';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedSocket extends Socket {
  handshake: Socket['handshake'] & {
    auth: {
      token: string;
      user?: JwtPayload;
    };
  };
}
