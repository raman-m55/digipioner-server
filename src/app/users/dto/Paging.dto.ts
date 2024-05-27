import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @ApiProperty()
  page_number: string;

  @ApiProperty()
  @IsOptional()
  per_page: string;
}
