import { ApiProperty } from '@nestjs/swagger';

export class currentUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  display_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  user: string;
}
