import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}
  async uploadMedia(file: any) {
    const path = file.path;
    const correctionPath = path.replace(/static[\\/]/g, ''); // استفاده از رجکس برای حذف 'static/' و 'static\\'
    const newPath = 'https://digipionerapi.liara.run/' + correctionPath;
    const media = await this.mediaRepository.create({ path: newPath });
    await this.mediaRepository.save(media);
    return { message: 'رسانه با موفقیت بارگذاری شد' };
  }

  async findAllMedia(pagingDto) {
    const per_page =
      !pagingDto.per_page || parseInt(pagingDto.per_page) < 1
        ? 10
        : parseInt(pagingDto.per_page);
    const page_number =
      !pagingDto.page_number || parseInt(pagingDto.page_number) < 1
        ? 1
        : parseInt(pagingDto.page_number);

    const [results, total] = await this.mediaRepository.findAndCount({
      skip: (page_number - 1) * per_page,
      take: per_page,
    });
    return {
      results,
      total,
      page_number,
      per_page,
      last_page: Math.ceil(total / per_page),
      message: 'لیست کاربر ها با موفقیت یافت شد',
    };
  }
}
