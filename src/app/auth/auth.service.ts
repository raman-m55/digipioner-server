import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { currentUserDto } from '../users/dto/currentUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async createUser(signupAuthDto: SignupAuthDto) {
    const userExists = await this.usersService.findUserByEmail(
      signupAuthDto.email,
    );
    if (userExists)
      throw new BadRequestException('با این ایمیل حسابی از قبل وجود دارد');
    const checkUniqueUsername = await this.usersService.findOneUserByUsername(
      signupAuthDto.username,
    );
    if (checkUniqueUsername)
      throw new BadRequestException('این نام کاربری از قبل وجود دارد');

    signupAuthDto.password = await bcrypt.hash(signupAuthDto.password, 10);
    const dataUser = { ...signupAuthDto, role: 'user' };
    let user = await this.userRepository.create(dataUser);
    user = await this.userRepository.save(user);
    const accessToken = await this.createJwtToken(user.id, user.username);
    delete user.password;
    return { user, accessToken, message: 'ثبت نام با موفقیت انجام شد' };
  }

  async signIn(signInAuthDto: SignInAuthDto) {
    const userExists = await this.usersService.findUserByEmail(
      signInAuthDto.email,
    );
    if (!userExists) throw new BadRequestException('لطفا ثبت نام کنید');
    const matchPassword = await bcrypt.compare(
      signInAuthDto.password,
      userExists.password,
    );
    if (!matchPassword) throw new BadRequestException('رمز عبور اشتباه است');
    delete userExists.password;
    const accessToken = await this.createJwtToken(
      userExists.id,
      userExists.username,
    );
    return { userExists, accessToken, message: 'ورود با موفقیت انجام شد' };
  }

  async createJwtToken(id, username) {
    const payload = { sub: id, username };
    const secret = this.configService.get<string>('SECRET_JWT');
    const expiresIn =
      Number(this.configService.get<string>('JWT_EXPIRE_TOME')) * 24 * 60 * 60;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async checkLoginUser(currentUser: currentUserDto) {
    if (currentUser) return { data: true };
    if (!currentUser) return { data: false };
  }
}
