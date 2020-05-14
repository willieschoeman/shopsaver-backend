import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongoModule } from 'nest-mongodb';
import { MulterModule } from '@nestjs/platform-express';
import { MongoService } from './services/mongo/mongo.service';
import { AuthenticateController } from './controllers/authenticate/authenticate.controller';
import { AuthenticateMiddleware } from './middleware/authenticate.middleware';
import { AuthenticateService } from './controllers/authenticate/authenticate.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './controllers/product/product.service';
import { TokenService } from './services/token/token.service';
import { UtilService } from './services/util/util.service';
import { ApiService } from './services/api/api.service';
import { ShopController } from './controllers/shop/shop.controller';
import { ShopService } from './controllers/shop/shop.service';

@Module({
  imports: [
    MongoModule.forRoot('mongodb://mongo', 'shopsaver', {
      useUnifiedTopology: true,
      useNewUrlParser: true
      }),
    MulterModule
  ],
  controllers: [
    AuthenticateController,
    ProductController,
    ShopController
  ],
  providers: [
    MongoService, 
    AuthenticateService,
    ProductService, 
    TokenService, UtilService, ApiService, ShopService
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
