import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library'; // For Google OAuth

@Controller('auth')
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(private readonly authService: AuthService) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { email, password, name } = signUpDto;
    const user = await this.authService.signUp(email, password, name);
    res.status(201).json({ message: 'User created', user });
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { email, password } = signInDto;
    const token = await this.authService.signIn(email, password);
    res.status(200).json({ message: 'Sign-in successful', token });
  }

  @Post('signout')
  signOut(@Req() req: Request, @Res() res: Response) {
    // Invalidate the token or session (implementation depends on your setup)
    res.status(200).json({ message: 'Sign-out successful' });
  }

  @Post('oauth/google')
  async googleOAuth(@Body('token') token: string, @Res() res: Response) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name, picture } = payload!;

      const user = await this.authService.handleOAuth(
        email!,
        name!,
        picture!,
        'google',
      );
      res.status(200).json({ message: 'OAuth successful', user });
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw new UnauthorizedException('Invalid OAuth token');
    }
  }
}
