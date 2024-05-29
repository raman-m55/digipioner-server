import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { currentUserDto } from '../users/dto/currentUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Role } from 'src/utility/common/user-role.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@ApiTags('categories')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: currentUserDto,
  ) {
    return this.categoriesService.createCategory(
      createCategoryDto,
      currentUser,
    );
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
