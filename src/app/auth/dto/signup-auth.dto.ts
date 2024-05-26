import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupAuthDto {
  @IsNotEmpty({ message: 'لطفا نام کاربری را وارد کنید' })
  @IsString()
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  username: string;

  @IsNotEmpty({ message: 'لطفا نام کاربری را وارد کنید' })
  @IsString()
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  display_name: string;

  @IsNotEmpty({ message: 'لطفا ایمیل را وارد کنید' })
  @IsEmail({}, { message: 'لطفا یک ایمیل معتبر وارد کنید' })
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  email: string;

  @IsNotEmpty({ message: 'لطفا رمز عبور را وارد کنید' })
  @MinLength(3, { message: 'رمز عبور باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'رمز عبور نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  password: string;
}
