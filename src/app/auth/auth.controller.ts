import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { currentUserDto } from '../users/dto/currentUser.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'مشخصات کاربر به علاوه توکن و مسیح',
  })
  @ApiResponse({
    status: 400,
    description: ' که از قبل وجود دارد',
  })
  @ApiResponse({
    status: 400,
    description: ' نام کاربری که از قبل وجود دارد',
  })
  @Post('sign-up')
  create(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.createUser(signupAuthDto);
  }

  @ApiResponse({
    status: 200,
    description: 'مشخصات کاربر به علاوه توکن و مسیح',
  })
  @ApiResponse({
    status: 400,
    description: 'کاربر ثبت نان نکرده است',
  })
  @Post('sign-in')
  signIn(@Body() signupAuthDto: SignInAuthDto) {
    return this.authService.signIn(signupAuthDto);
  }

  @ApiResponse({
    status: 400,
    description: 'مقدار درست یا نادرست (false or true)',
  })
  @Get('check-login')
  checkLogin(@CurrentUser() currentUser: currentUserDto) {
    return this.authService.checkLoginUser(currentUser);
  }
}
