import { Injectable } from '@nestjs/common';
import { MongoService } from '../../services/mongo/mongo.service';
import { TokenService } from '../../services/token/token.service'

@Injectable()
export class AuthenticateService {

    private readonly usersCollection: string = 'users'
 
    constructor(private mongoService: MongoService, private tokenService: TokenService) {
    }

    async authenticate(body: any) {

        const query = {"email": body.username}

        const user = await this.mongoService.findMongo(this.usersCollection, query)

        if (user[0]?.password === body.password) {

            let token = await this.tokenService.generateToken(user[0]._id)
            delete user[0].password
            user[0].token = token

            return {
                success: true,
                message: 'Successfully logged in!',
                response: {
                    user: user[0]
                }
            }

        } else {
            return {
                success: false,
                message: 'Incorrect user details!'
            }
        }

    }
}