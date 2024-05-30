import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { PagingDto } from '../users/dto/Paging.dto';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}
  async createTag(createTagDto: CreateTagDto, currentUser: CurrentUserDto) {
    const tag = await this.tagRepository.create(createTagDto);
    tag.addedBy = currentUser;
    await this.tagRepository.save(tag);
    return { message: ' تگ با موفقیت ایجاد شد' };
  }

  async findAllTags(pagingDto: PagingDto) {
    const per_page =
      !pagingDto.per_page || parseInt(pagingDto.per_page) < 1
        ? 10
        : parseInt(pagingDto.per_page);
    const page_number =
      !pagingDto.page_number || parseInt(pagingDto.page_number) < 1
        ? 1
        : parseInt(pagingDto.page_number);

    const [results, total] = await this.tagRepository.findAndCount({
      skip: (page_number - 1) * per_page,
      take: per_page,
      relations: ['addedBy'],
      select: {
        addedBy: {
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
      message: 'لیست تگ ها با موفقیت یافت شد',
    };
  }

  async findOneTag(id: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['addedBy'],
      select: {
        addedBy: {
          id: true,
          username: true,
          display_name: true,
        },
      },
    });
    return { tag, message: ' تگ با موفقیت یافت شد' };
  }

  async updateTagById(id: number, updateTagDto: UpdateTagDto) {
    await this.tagRepository.update(id, updateTagDto);
    return { message: 'تگ با موفقیت به روز رسانی شد' };
  }

  async removeTagById(id: number) {
    await this.tagRepository.delete(id);
    return { message: 'تگ با موفقیت حذف شد' };
  }

  async findTagByIds(ids: number[]) {
    return await this.tagRepository.findBy({ id: In(ids) });
  }
}
