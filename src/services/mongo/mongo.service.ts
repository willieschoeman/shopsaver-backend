import { Injectable, NotFoundException } from '@nestjs/common';
import * as mongo from 'mongodb';
import { InjectDb } from 'nest-mongodb';

@Injectable()
export class MongoService {

    private readonly configCollection: mongo.Collection
    private readonly productsCollection: mongo.Collection
    private readonly shopsCollection: mongo.Collection
    private readonly usersCollection: mongo.Collection
    private collectionMap: any

    constructor(@InjectDb() private readonly db: mongo.Db) {

        this.configCollection = this.db.collection('config')
        this.productsCollection = this.db.collection('products')
        this.shopsCollection = this.db.collection('shops')
        this.usersCollection = this.db.collection('users')

        this.collectionMap = {
            config: this.configCollection,
            products: this.productsCollection,
            shops: this.shopsCollection,
            users: this.usersCollection
        }
    }

    // Find Mongo By ID
    public async findOneMongo(collection: string, id: string) {

        let result;

        try {
            result = await this.collectionMap[collection].find({ "_id": new mongo.ObjectID(id) }).toArray()
        } catch (error) {
            throw new NotFoundException('Unable to find!');
        }

        if (!result) {
            throw new NotFoundException('Unable to find!');
        }

        return result;
    }

    // Find Mongo Any
    public async findMongo(collection: string, query: any) {

        let result;

        try {
            result = await this.collectionMap[collection].find(query).toArray();
        } catch (error) {
            throw new NotFoundException('Unable to find!');
        }

        if (!result) {
            throw new NotFoundException('Unable to find!');
        }

        return result;
    }

    // Insert Mongo One
    public async insertOneMongo(collection: string, body: any) {

        let result;

        try {
            result = await this.collectionMap[collection].insertOne(body)
        } catch (error) {
            throw new NotFoundException('Unable to insert!');
        }

        if (!result) {
            throw new NotFoundException('Unable to insert!');
        }

        return result;
    }

    // Delete Mongo By ID
    public async deleteOneMongo(collection: string, id: string) {

        let result;

        try {
            result = await this.collectionMap[collection].deleteOne({ "_id": new mongo.ObjectID(id) })
        } catch (error) {
            throw new NotFoundException('Unable to delete!');
        }

        if (!result) {
            throw new NotFoundException('Unable to delete!');
        }

        return result;
    }

    // Update Mongo By ID
    public async updateOneMongo(collection: string, id: string, body: any) {

        let result;

        try {
            result = await this.collectionMap[collection].updateOne({ "_id": new mongo.ObjectID(id) }, { $set: body })
        } catch (error) {
            throw new NotFoundException('Unable to update!');
        }

        if (!result) {
            throw new NotFoundException('Unable to update!');
        }

        return result;
    }

}