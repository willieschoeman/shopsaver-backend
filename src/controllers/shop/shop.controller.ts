import { Controller, Post, Delete, Put, Get, Req } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Request } from 'express';

@Controller('shop')
export class ShopController {

    constructor(private shopService: ShopService) {
    }

    // Get shops any query
    @Post('getshop')
    async getShop(@Req() request: Request) {

        const query = request.body
        return this.shopService.getShop(query)
    }

    // Get a shop by ID
    @Get('getshop/:id')
    async getShopById(@Req() request: Request) {

        const shopId = request.params.id
        return this.shopService.getShopById(shopId)
    }

}
