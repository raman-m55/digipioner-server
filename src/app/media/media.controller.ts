import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/utility/config/config.multer';
import { PagingDto } from './dto/Paging.dto';
import { Roles } from 'src/utility/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Role } from 'src/utility/common/user-role.enum';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@ApiTags('Media')
@Roles(Role.Admin)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('users')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOption))
  uploadMedia(@UploadedFile() file) {
    return this.mediaService.uploadMedia(file);
  }

  @Get('upload')
  @UseInterceptors(FileInterceptor('file', multerOption))
  fineAll(@Query() pagingDto: PagingDto) {
    return this.mediaService.findAllMedia(pagingDto);
  }
}
