import { Injectable } from '@nestjs/common';
import { MongoService } from '../../services/mongo/mongo.service';
import { UtilService } from '../../services/util/util.service';

@Injectable()
export class ShopService {

    private readonly shopCollection: string = 'shops'

    constructor(private mongoService: MongoService, private utilService: UtilService) {
    }

    // Generic get shop based on any query
    async getShops(query: any) {

        const shops = await this.mongoService.findMongo(this.shopCollection, query)

        if (shops) {

            // Sort true first, then false
            shops.sort(function (a, b) {
                return b.active - a.active
            })

            return {
                success: true,
                message: 'Successfully retrieved shops!',
                response: {
                    shops: shops
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to retrieve shops!'
            }
        }
    }

    // Get shop by shopId
    async getShopById(query: any) {

        if (!query.id) {
            return {
                success: false,
                message: 'Unable to retrieve shop!'
            }
        }

        let shopId = query.id
        const shop = await this.mongoService.findOneMongo(this.shopCollection, shopId)

        if (shop) {

            return {
                success: true,
                message: 'Successfully retrieved shop!',
                response: {
                    shop: shop[0]
                }
            }

        } else {
            return {
                success: false,
                message: 'Unable to retrieve shop!'
            }
        }
    }

}
