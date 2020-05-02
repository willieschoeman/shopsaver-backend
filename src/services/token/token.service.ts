import { Injectable } from '@nestjs/common';
import { MongoService } from '../mongo/mongo.service';
import { Uuid } from 'node-ts-uuid';
import * as mongo from 'mongodb';

@Injectable()
export class TokenService {

    private readonly usersCollection: string = 'users'
 
    constructor(private mongoService: MongoService) {
    }

    async validateToken(userId: string, token: string) {

        let query = { "_id": new mongo.ObjectID(userId) }

        const user = await this.mongoService.findMongo(this.usersCollection, query)

        if (user[0]?.token === token) {
            return true
        } else {
            return false
        }
    }

    async generateToken(userId: string) {

        const token: string = Uuid.generate({length: 50})
        await this.mongoService.updateOneMongo(this.usersCollection, userId, { token: token })
        return token
    }

}