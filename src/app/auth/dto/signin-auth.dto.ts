import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInAuthDto {
  @ApiProperty({
    description: 'ایمیل کاربر',
  })
  @IsNotEmpty({ message: 'لطفا ایمیل را وارد کنید' })
  @IsEmail({}, { message: 'لطفا یک ایمیل معتبر وارد کنید' })
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  email: string;

  @ApiProperty({
    description: 'رمز عبور کاربر',
    minLength: 3,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'لطفا رمز عبور را وارد کنید' })
  @MinLength(3, { message: 'رمز عبور باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'رمز عبور نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  password: string;
}
