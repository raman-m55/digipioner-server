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
    const expiresIn = this.configService.get<string>('JWT_EXPIRE_TOME');
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}