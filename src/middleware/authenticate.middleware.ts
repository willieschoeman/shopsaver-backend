import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenService } from '../services/token/token.service';

// Can access these URL's without AUTH
const nonAuthUrls = [
  '/api/product/getproductbylocation'
]

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {

  constructor(private tokenService: TokenService) {
  }

  async use(req: any, res: any, next: () => void) {

    // Check if we have the source header
    if (!req.headers['x-source']) {
      return res.json({ success: false, message: 'Missing headers!' })
    }

    // Check if source is valid
    if (req.headers['x-source'] !== 'portal' && req.headers['x-source'] !== 'mobile') {
      return res.json({ success: false, message: 'Unknown source!' })
    }

    // Get the request url
    let url = req.baseUrl

    // For any non auth url's do some validation (security)
    if (!url.startsWith('/api/authenticate') && !nonAuthUrls.includes(url)) {

      if (!req.headers['x-token'] || !req.headers['x-user']) {
        return res.json({ success: false, message: 'Missing headers!' })
      }

      // Check the token against the user
      let token = req.headers['x-token']
      let user = req.headers['x-user']

      let isTokenValid = await this.tokenService.validateToken(user, token)

      if (!isTokenValid) {
        return res.json({ success: false, message: 'Invalid token!' })
      }
    }

    next()
  }
}
