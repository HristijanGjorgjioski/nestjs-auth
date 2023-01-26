import { Controller, Body, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }
}
