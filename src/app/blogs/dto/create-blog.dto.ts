import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'تیتر بلاگ',
    minLength: 3,
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'لطفا تیتر بلگ را وارد کنید' })
  @IsString()
  @MinLength(3, { message: 'تیتر باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(50, { message: 'تیتر نمی‌تواند بیش از 50 کاراکتر باشد' })
  title: string;

  @ApiProperty({
    description: 'اسلاگ وبلاگ (url)',
    minLength: 3,
    maxLength: 40,
  })
  @IsNotEmpty({ message: 'اسلاگ را وارد کنید' })
  @IsString()
  @MinLength(3, { message: 'اسلاگ باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(50, { message: 'اسلاگ نمی‌تواند بیش از 50 کاراکتر باشد' })
  slug: string;

  @ApiProperty({
    description: 'توضیحات کوتاه بلاگ',
    minLength: 3,
    maxLength: 40,
  })
  @IsNotEmpty({ message: 'توضیحات کوتاه وبلاگ را وارد کنید' })
  @IsString()
  @MinLength(3, { message: 'توضیحات کوتاه وبلاگ باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(150, { message: 'توضحات کوتاه نمی‌تواند بیش از 150 کاراکتر باشد' })
  excerpt: string;

  @ApiProperty({
    description: 'محتوای بلاگ',
    minLength: 3,
    maxLength: 40,
  })
  @IsNotEmpty({ message: ' محتوای بلاگ را وارد کنید' })
  content: string;

  @ApiProperty({
    description: 'ایدی دسته مورد نظر',
  })
  @IsNotEmpty({ message: 'دسته بندی نمیتواند خالی باشد' })
  @IsNumber({}, { message: 'دسته بندی باید یک عدد باشد' })
  category: number;

  @ApiProperty({
    description: 'یک ارایه از ایدی تگ ها',
  })
  @IsArray({ message: 'تگ‌ها باید به صورت آرایه باشند' })
  @ArrayMinSize(1, { message: 'حداقل باید یک تگ انتخاب شود' })
  @IsInt({ each: true, message: 'هر تگ باید یک عدد صحیح باشد' })
  tags: number[];
}
