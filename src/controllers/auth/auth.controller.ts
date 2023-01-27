import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {Public} from 'src/decorators/isPublic.decorator';
import {AuthService} from 'src/services/auth/auth.service';
import {LocalAuthGuard} from 'src/services/auth/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@ApiCreatedResponse({description: 'Successfully signed user'})
	@ApiUnauthorizedResponse({description: 'Wrong credentials'})
	@Post('login')
	login(@Request() req) {
		return this.authService.login(req.user);
	}
}
