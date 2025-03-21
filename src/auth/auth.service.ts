import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class AuthService extends BaseService {
  async signUp(email: string, password: string, name: string) {
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.db
      .insert(users)
      .values({ email, password: hashedPassword, name })
      .returning()
      .then((r) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = r[0];
        return user;
      });

    return newUser;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || '',
    );

    if (!user || !isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    return token;
  }

  async handleOAuth(
    email: string,
    name: string,
    avatar: string,
    provider: string,
  ) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user) {
      return user;
    }

    const newUser = await this.db
      .insert(users)
      .values({ email, name, avatar, oauthProvider: provider })
      .returning()
      .then((r) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = r[0];
        return user;
      });

    return newUser;
  }
}
