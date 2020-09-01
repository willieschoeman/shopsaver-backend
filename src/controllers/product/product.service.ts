import { Injectable } from '@nestjs/common';
import { MongoService } from '../../services/mongo/mongo.service';
import { UtilService } from '../../services/util/util.service';

@Injectable()
export class ProductService {

    private readonly productCollection: string = 'products'

    constructor(private mongoService: MongoService, private utilService: UtilService) {
    }

    // Generic get product based on any query
    async getProducts(query: any) {

        const products = await this.mongoService.findMongo(this.productCollection, query)

        if (products) {

            // Sort true first, then false
            products.sort(function (a, b) {
                return a.active - b.active
            })

            return {
                success: true,
                message: 'Successfully retrieved products!',
                response: {
                    products: products
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to retrieve products!'
            }
        }
    }

    // Get products withing a location
    // Mongo - first lon then lat
    // Google - first lat then lon
    async getProductByLocation(query: any) {


        if (!query.lon || !query.lat || !query.distance) {
            return {
                success: false,
                message: 'Unable to retrieve products!'
            }
        }

        const meters = +query.distance
        const longitude = +query.lon
        const latitude = +query.lat

        delete query.distance
        delete query.lon
        delete query.lat

        if (query?.category === '') {
            delete query.category
        }

        if (query?.maxPrice) {
            query.productPriceNow = {
                $lte: query.maxPrice
            }
            delete query.maxPrice
        }
        
        const mongoQuery = {
            active: true,
            ...query,
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: meters
                }
            }
        }

        const products = await this.mongoService.findMongo(this.productCollection, mongoQuery)

        if (products) {

            // Add a distance field
            for (let product of products) {
                product.distance = (await this.utilService.getDistanceInKm(longitude, latitude, product.location.coordinates[0], product.location.coordinates[1])).toFixed(2)
            }

            return {
                success: true,
                message: 'Successfully retrieved products!',
                response: {
                    products: products
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to retrieve products!'
            }
        }
    }

    // Get product by productId
    async getProductById(query: any) {

        if (!query.id) {
            return {
                success: false,
                message: 'Unable to retrieve product!'
            }
        }

        let productId = query.id
        const product = await this.mongoService.findOneMongo(this.productCollection, productId)

        if (product) {

            return {
                success: true,
                message: 'Successfully retrieved product!',
                response: {
                    product: product[0]
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to retrieve product!'
            }
        }
    }

    // Add a product by userId
    async addProduct(query: any) {

        const result = await this.mongoService.insertOneMongo(this.productCollection, query)

        if (result?.insertedCount === 1) {

            return {
                success: true,
                message: 'Successfully added product!',
                response: {
                    insertedId: result.insertedId
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to add product!'
            }
        }
    }


    // Delete a product by productId
    async deleteProductById(query: any) {

        if (!query.id) {
            return {
                success: false,
                message: 'Unable to delete product!'
            }
        }

        let productId = query.id
        const result = await this.mongoService.deleteOneMongo(this.productCollection, productId)

        if (result?.deletedCount === 1) {

            return {
                success: true,
                message: 'Sucessfully deleted product!',
            }

        } else {
            return {
                success: false,
                message: 'Unable to delete product!'
            }
        }
    }

    // Update a product by productId
    async updateProductById(query) {

        if (!query.id) {
            return {
                success: false,
                message: 'Unable to update product!'
            }
        }

        let productId = query.id
        delete query.id

        const result = await this.mongoService.updateOneMongo(this.productCollection, productId, query)

        if (result?.modifiedCount === 1) {

            return {
                success: true,
                message: 'Sucessfully updated product!',
            }

        } else if (result?.modifiedCount === 0 && result?.matchedCount === 1) {
            return {
                success: false,
                message: 'You did not update anything on the existing product!',
            }
        } else {
            return {
                success: false,
                message: 'Unable to update product!'
            }
        }
    }

}
