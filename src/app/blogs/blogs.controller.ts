import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { PagingDto } from '../users/dto/Paging.dto';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Role } from 'src/utility/common/user-role.enum';

@ApiTags('Blogs')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.blogsService.createBlog(createBlogDto, currentUserDto);
  }

  @Get()
  findAll(@Query() pagingDto: PagingDto) {
    return this.blogsService.findAllPosts(pagingDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOneBlog(+id);
  }
  @Get(':slug')
  findSlug(@Param('id') slug: string) {
    return this.blogsService.findOneBlogBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() currentUserDto: CurrentUserDto,
  ) {
    return this.blogsService.updateBlogById(+id, updateBlogDto, currentUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.removeBlogById(+id);
  }
}
