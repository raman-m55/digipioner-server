import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/utility/config/config.multer';
import { PagingDto } from './dto/Paging.dto';

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
