import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CategoriesService } from '../categories/categories.service';
import { TagsService } from '../tags/tags.service';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Category, Tag])],
  controllers: [BlogsController],
  providers: [BlogsService, CategoriesService, TagsService],
})
export class BlogsModule {}
