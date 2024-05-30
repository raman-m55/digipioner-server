import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { PagingDto } from '../users/dto/Paging.dto';
import { TagsService } from '../tags/tags.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly tagsService: TagsService,
    private readonly categoriesService: CategoriesService,
  ) {}
  async createBlog(
    createBlogDto: CreateBlogDto,
    currentUserDto: CurrentUserDto,
  ) {
    const searchSlug = await this.searchBlogBySlug(createBlogDto.slug);
    if (searchSlug)
      throw new BadRequestException('لطفا اسلاگ دیگری انتخواب کنید');

    const category = await this.categoriesService.findOneCategory(
      +createBlogDto.category,
    );
    if (!category) throw new BadRequestException('دسته بندی نامعتبر است');

    const tags = await this.tagsService.findTagByIds(createBlogDto.tags);
    if (tags.length !== createBlogDto.tags.length)
      throw new BadRequestException('تگ‌های نامعتبر');

    const dataBlog = {
      title: createBlogDto.title,
      slug: createBlogDto.slug,
      excerpt: createBlogDto.excerpt,
      content: createBlogDto.content,
      category: category.category,
      tags,
      author: currentUserDto,
    };

    const blog = await this.blogRepository.create(dataBlog);
    await this.blogRepository.save(blog);
    return { message: 'بلاگ با موفقیت ساخته شد  ' };
  }

  async findAllPosts(pagingDto: PagingDto) {
    const per_page =
      !pagingDto.per_page || parseInt(pagingDto.per_page) < 1
        ? 10
        : parseInt(pagingDto.per_page);
    const page_number =
      !pagingDto.page_number || parseInt(pagingDto.page_number) < 1
        ? 1
        : parseInt(pagingDto.page_number);

    const [results, total] = await this.blogRepository.findAndCount({
      skip: (page_number - 1) * per_page,
      take: per_page,
      relations: ['author'],
      select: {
        author: {
          id: true,
          username: true,
          display_name: true,
        },
      },
    });
    return {
      results,
      total,
      page_number,
      per_page,
      last_page: Math.ceil(total / per_page),
      message: 'لیست بلاگ ها با موفقیت یافت شد',
    };
  }

  async findOneBlog(id: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'tags'],
      select: {
        author: {
          id: true,
          username: true,
          display_name: true,
        },
      },
    });
    return { blog, message: 'بلاگ با موفقیت یافت شد' };
  }

  async findOneBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'tags'],
      select: {
        author: {
          id: true,
          username: true,
          display_name: true,
        },
      },
    });
    return { blog, message: 'بلاگ با موفقیت یافت شد' };
  }
  async updateBlogById(
    id: number,
    updateBlogDto: UpdateBlogDto,
    currentUserDto: CurrentUserDto,
  ) {
    const searchSlug = await this.searchBlogBySlug(updateBlogDto.slug);
    if (searchSlug)
      throw new BadRequestException('لطفا اسلاگ دیگری انتخواب کنید');

    const category = await this.categoriesService.findOneCategory(
      +updateBlogDto.category,
    );
    if (!category) throw new BadRequestException('دسته بندی نامعتبر است');

    const tags = await this.tagsService.findTagByIds(updateBlogDto.tags);
    if (tags.length !== updateBlogDto.tags.length)
      throw new BadRequestException('تگ‌های نامعتبر');

    const dataBlog = {
      title: updateBlogDto.title,
      slug: updateBlogDto.slug,
      excerpt: updateBlogDto.excerpt,
      content: updateBlogDto.content,
      category: category.category,
      tags,
      author: currentUserDto,
    };

    await this.blogRepository.update(id, dataBlog);
    return { message: 'بلاگ با موفقیت به روز رسانی شد' };
  }

  async removeBlogById(id: number) {
    await this.blogRepository.delete(id);
    return { message: 'بلاگ با موفقیت حذف شد' };
  }

  async searchBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({ where: { slug } });
    return blog;
  }
}
