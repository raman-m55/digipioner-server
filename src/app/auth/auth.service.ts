import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { Codes } from './entities/codes.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Codes)
    private readonly codesRepository: Repository<Codes>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async otp(signInAuthDto: SignInAuthDto) {
    if (signInAuthDto.code) {
      //بررسی این که کد ارسال شده در دیتابیس وجود دارد و ایا معتبر هست
      const checkCode = await this.codesRepository.findOne({
        where: {
          code: signInAuthDto.code,
          email: signInAuthDto.email,
          is_used: false,
          expired: false,
        },
      });

      if (checkCode) {
        const currentTime = new Date();
        //بررسی این که ایا معتبر بودن کد تمام شده یا خیر
        if (currentTime > checkCode.expiresAt) {
          await this.codesRepository.update(checkCode.id, { expired: true });
          throw new HttpException('کد منقضی شده', 403);
        }

        await this.codesRepository.update(checkCode.id, { is_used: true });
        const userExists = await this.usersService.findUserByEmail(
          signInAuthDto.email,
        );

        if (userExists) {
          const accessToken = await this.createJwtToken(userExists.id);
          return {
            user: userExists,
            accessToken,
            message: 'ورود با موفقیت انجام شد',
          };
        } else {
          const newUser = this.userRepository.create({
            email: signInAuthDto.email,
          });
          await this.userRepository.save(newUser);
          const accessToken = await this.createJwtToken(newUser.id);
          return {
            user: newUser,
            accessToken,
            message: 'ورود با موفقیت انجام شد',
          };
        }
      } else {
        throw new HttpException('کد معتبر نیست', 400);
      }
    } else {
      //ساخت کد 5 رقمی که در دیتابیس وجود ندارد
      const otp = await this.generateOtpCode();
      const currentTime = new Date();
      const expiresAt = new Date(currentTime.getTime() + 120 * 1000);
      //ذخیره کد در دیتا بیس
      await this.codesRepository.save({
        code: otp,
        email: signInAuthDto.email,
        expiresAt,
      });
      //send otp code to user
      setImmediate(async () => {
        await this.mailerService.sendMail({
          text: 'رمز عبور شما به بنی تک',
          subject: 'ورد به بنی تک',
          to: signInAuthDto.email,
          template: 'sendPassword.html',
          context: {
            password: otp,
          },
        });
      });
    }
  }

  async createJwtToken(id) {
    const payload = { sub: id };
    const secret = this.configService.get<string>('SECRET_JWT');
    const expiresIn =
      Number(this.configService.get<string>('JWT_EXPIRE_TOME')) * 24 * 60 * 60;
    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async checkLoginUser(currentUser: CurrentUserDto) {
    if (currentUser && currentUser.role === 'admin') {
      return { isLogin: true, isAdmin: true };
    }
    if (currentUser && currentUser.role === 'user') {
      return { isLogin: true, isAdmin: false };
    }
    if (!currentUser) return { isLogin: false, isAdmin: false };
  }

  async generateOtpCode() {
    //ساخت کد 5 رقمی که در دیتابیس وجود ندارد
    let code: number = null;
    while (!code) {
      const fiveDigitCode = this.getRandomCode();
      const checkCode = await this.codesRepository.findOne({
        where: { code: fiveDigitCode },
      });
      if (!checkCode) {
        code = fiveDigitCode;
        break;
      }
    }
    return code;
  }

  getRandomCode() {
    const min = 10000;
    const max = 99999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
  }
}
