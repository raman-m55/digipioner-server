import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'نام نمایشی کاربر',
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'لطفا نام دسته را وارد کنید' })
  @IsString()
  @MinLength(2, { message: 'نام دسته باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(50, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  title: string;
}
