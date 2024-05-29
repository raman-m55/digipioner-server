import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/app/categories/entities/category.entity';

export class currentUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  display_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [Category] })
  categories: Category[];
}
