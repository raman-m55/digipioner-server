import {
  Controller,
  Post,
  Body,
  UseGuards,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { CurrentUserDto } from '../users/dto/currentUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Role } from 'src/utility/common/user-role.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { PagingDto } from '../users/dto/Paging.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query() pagingDto: PagingDto) {
    return this.categoriesService.findAllCategories(pagingDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.categoriesService.findOneCategory(+id);
  }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return this.categoriesService.createCategory(
      createCategoryDto,
      currentUser,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategoryById(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.categoriesService.removeCategoryById(+id);
  }
}
