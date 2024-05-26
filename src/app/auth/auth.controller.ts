import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.createUser(signupAuthDto);
  }

  @Post('sign-in')
  signIn(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signIn(signupAuthDto);
  }
}
