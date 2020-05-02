import { Controller, Post, Req } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { Request } from 'express';

@Controller('authenticate')
export class AuthenticateController {

    constructor (private authService: AuthenticateService) {  
    }

    @Post('login')
    async authenticate(@Req() request: Request) {
        const query = request.body
        return this.authService.authenticate(query)
    }
}