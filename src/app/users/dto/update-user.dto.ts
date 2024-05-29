import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'نام نمایشی کاربر',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'نام کاربری نمی‌تواند بیش از ۲۰ کاراکتر باشد' })
  display_name: string;

  @ApiProperty({
    description: 'نقش کاربر',
    enum: ['user', 'admin'],
    example: 'user',
  })
  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'نقش باید یا user باشد یا admin' })
  role: string;
}
