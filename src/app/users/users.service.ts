import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from './dto/Paging.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { currentUserDto } from './dto/currentUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOneUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('کاربری با این ایدی یافت نشد');
    return user;
  }

  async findOneUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async findAllUser(pagingDto: PagingDto) {
    const per_page =
      !pagingDto.per_page || parseInt(pagingDto.per_page) < 1
        ? 10
        : parseInt(pagingDto.per_page);
    const page_number =
      !pagingDto.page_number || parseInt(pagingDto.page_number) < 1
        ? 1
        : parseInt(pagingDto.page_number);

    const [results, total] = await this.userRepository.findAndCount({
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

  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return { message: 'کاربر با به روز رسانی حذف شد' };
  }

  async removeUserById(id: number) {
    await this.userRepository.delete(id);
    return { message: 'کاربر با موفقیت حذف شد' };
  }

  async dataUser(currentUser: currentUserDto) {
    if (!currentUser) throw new BadRequestException('عدم دسترسی');
    return currentUser;
  }
}
