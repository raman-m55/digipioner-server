import { IsOptional } from 'class-validator';

export class PagingDto {
  @IsOptional()
  page_number: string;

  @IsOptional()
  per_page: string;
}
