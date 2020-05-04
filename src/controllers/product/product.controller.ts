import { Controller, Post, Delete, Put, Get, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { Request } from 'express';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) {
    }

    // Get products any query
    @Post('getproducts')
    async getProduct(@Req() request: Request) {

        const query = request.body
        return this.productService.getProducts(query)
    }

    // Get products by location
    @Post('getproductbylocation')
    async getProductByLocation(@Req() request: Request) {

        const query = request.body
        return this.productService.getProductByLocation(query)
    }

    // Get a product by ID
    @Post('getproduct')
    async getProductById(@Req() request: Request) {

        const query = request.body
        return this.productService.getProductById(query)
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
    @Post('deleteproduct')
    async deleteProductById(@Req() request: Request) {

        const query = request.body
        return this.productService.deleteProductById(query)
    }

    // Update a product by ID
    @Post('updateproduct')
    async updateProductById(@Req() request: Request) {

        const query = request.body
        return this.productService.updateProductById(query)
    }

}
