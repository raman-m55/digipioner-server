import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PagingDto } from '../users/dto/Paging.dto';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { Role } from 'src/utility/common/user-role.enum';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';

@ApiTags('tags')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get()
  findAll(@Query() pagingDto: PagingDto) {
    return this.tagsService.findAllTags(pagingDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.tagsService.findOneTag(+id);
  }

  @Post()
  create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.tagsService.createTag(createTagDto, currentUser);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.updateTagById(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tagsService.removeTagById(+id);
  }
}
