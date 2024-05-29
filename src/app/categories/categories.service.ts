import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { currentUserDto } from '../users/dto/currentUser.dto';
import { PagingDto } from '../users/dto/Paging.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(
    createCategoryDto: CreateCategoryDto,
    currentUser: currentUserDto,
  ) {
    const category = await this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    console.log(category);
    console.log(currentUser);
    await this.categoryRepository.save(category);
    return { message: 'دسته بندی با موفقیت ایجاد شد' };
  }

  async findAllCategories(pagingDto: PagingDto) {
    const per_page =
      !pagingDto.per_page || parseInt(pagingDto.per_page) < 1
        ? 10
        : parseInt(pagingDto.per_page);
    const page_number =
      !pagingDto.page_number || parseInt(pagingDto.page_number) < 1
        ? 1
        : parseInt(pagingDto.page_number);

    const [results, total] = await this.categoryRepository.findAndCount({
      skip: (page_number - 1) * per_page,
      take: per_page,
      relations: ['addedBy'],
    });
    return {
      results,
      total,
      page_number,
      per_page,
      last_page: Math.ceil(total / per_page),
      message: 'لیست دسته بندی ها با موفقیت یافت شد',
    };
  }

  async findOneCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });
    return { category, message: 'دسته بندی با موفقیت یافت شد' };
  }

  async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return { message: 'دسته بندی با موفقیت به روز رسانی شد' };
  }

  async removeCategoryById(id: number) {
    await this.categoryRepository.delete(id);
    return { message: 'دسته بندی با موفقیت حذف شد' };
  }
}
