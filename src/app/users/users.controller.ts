import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PagingDto } from './dto/Paging.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { currentUserDto } from './dto/currentUser.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Role } from 'src/utility/common/user-role.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
@ApiTags('users')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() currentUser: currentUserDto) {
    return await this.usersService.dataUser(currentUser);
  }

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
}
