import { Controller, Post, Delete, Put, Get, Req } from '@nestjs/common';
import { ShopService } from './shop.service';
import { Request } from 'express';

@Controller('shop')
export class ShopController {

    constructor(private shopService: ShopService) {
    }

    // Get shops any query
    @Post('getshops')
    async getShop(@Req() request: Request) {

        const query = request.body
        return this.shopService.getShops(query)
    }

    // Get a shop by ID
    @Post('getshop')
    async getShopById(@Req() request: Request) {

        const query = request.body
        return this.shopService.getShopById(query)
    }

}
