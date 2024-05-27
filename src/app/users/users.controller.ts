import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PagingDto } from './dto/Paging.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { currentUserDto } from './dto/currentUser.dto';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() pagingDto: PagingDto) {
    return this.usersService.findAllUser(pagingDto);
  }

  @ApiParam({
    name: 'id',
    description: 'ایدی کاربر جهت گرفتن مشخصات',
  })
  @ApiResponse({
    status: 200,
    description: 'مشخاصت کاربر',
    type: currentUserDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOneUserById(+id);
  }

  @ApiParam({
    name: 'id',
    description: 'ایدی کاربر جهت به روزرسانی کاربر',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserBuId(+id, updateUserDto);
  }

  @ApiParam({
    name: 'id',
    description: 'ایدی کاربر جهت حذف کاربر',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.removeUserById(+id);
  }

  @Get('me')
  me(@CurrentUser() currentUser: currentUserDto) {
    return this.usersService.checkLoginUser(currentUser);
  }
}
