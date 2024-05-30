import { ApiProperty } from '@nestjs/swagger';
import { Blog } from 'src/app/blogs/entities/blog.entity';
import { Category } from 'src/app/categories/entities/category.entity';

export class CurrentUserDto {
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

  @ApiProperty({ type: () => [Blog] })
  post_blogs: Blog[];
}
