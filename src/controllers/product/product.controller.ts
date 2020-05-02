import { Controller, Post, Delete, Put, Get, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { Request } from 'express';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {
    }

    // Get products any query
    @Post('getproduct')
    async getProduct(@Req() request: Request) {

        const query = request.body
        return this.productService.getProduct(query)
    }

    // Get products by location
    @Get('getproductbylocation/:lon/:lat/:meters')
    async getProductByLocation(@Req() request: Request) {

        const meters = +request.params.meters
        const longitude = +request.params.lon
        const latitude = +request.params.lat
        return this.productService.getProductByLocation(meters, longitude, latitude)
    }

    // Get a product by ID
    @Get('getproduct/:id')
    async getProductById(@Req() request: Request) {

        const productId = request.params.id
        return this.productService.getProductById(productId)
    }

    // Add products for a user
    @Post('addproduct')
    async addProduct(@Req() request: Request) {

        const userId = request.headers['x-user']
        const query = request.body
        query.userId = userId
        return this.productService.addProduct(query)
    }

    // Delete a product by ID
    @Delete('deleteproduct/:id')
    async deleteProductById(@Req() request: Request) {

        const productId = request.params.id
        return this.productService.deleteProductById(productId)
    }

    // Update a product by ID
    @Put('updateproduct/:id')
    async updateProductById(@Req() request: Request) {

        const productId = request.params.id
        let product = request.body
        return this.productService.updateProductById(productId, product)
    }

}
