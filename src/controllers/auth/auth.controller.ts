import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {Public} from 'src/decorators/isPublic.decorator';
import {AuthService} from 'src/services/auth/auth.service';
import {LocalAuthGuard} from 'src/services/auth/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req) {
		return this.authService.login(req.user);
	}
}
