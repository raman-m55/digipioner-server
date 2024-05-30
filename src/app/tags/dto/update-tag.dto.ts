import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty({ message: 'لطفا نام دسته را وارد کنید' })
  @IsString()
  @MinLength(2, { message: 'نام دسته باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(50, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  title: string;
}
