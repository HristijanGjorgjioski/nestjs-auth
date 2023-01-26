import { IsEmail, IsOptional } from 'class-validator';

export class EditUserDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  name?: string;
}
