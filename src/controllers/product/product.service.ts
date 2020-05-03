import { Injectable } from '@nestjs/common';
import { MongoService } from '../../services/mongo/mongo.service';
import { UtilService } from '../../services/util/util.service';

@Injectable()
export class ProductService {

    private readonly productCollection: string = 'products'

    constructor(private mongoService: MongoService, private utilService: UtilService) {
    }

    // Generic get product based on any query
    async getProduct(query: any) {

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
    async getProductByLocation(meters: number, lon: number, lat: number) {

        const query = {
            active: true,
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    },
                    $maxDistance: meters
                }
            }
        }

        const products = await this.mongoService.findMongo(this.productCollection, query)

        if (products) {

            // Add a distance field
            for (let product of products) {
                product.distance = (await this.utilService.getDistanceInKm(lon, lat, product.location.coordinates[0], product.location.coordinates[1])).toFixed(2)
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
    async getProductById(productId: string) {

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
    async deleteProductById(productId: string) {

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
    async updateProductById(id: string, body: any) {

        const result = await this.mongoService.updateOneMongo(this.productCollection, id, body)

        console.log(result)

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
                message: 'Unable to updated product!'
            }
        }
    }

}
