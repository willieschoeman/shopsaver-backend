import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenService } from '../services/token/token.service';

// Mobile can access these URL's without AUTH
const mobileUrls = [
]

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {

  constructor (private tokenService: TokenService) {  
  }

  async use(req: any, res: any, next: () => void) {

    // Check if we have the source header
    if (!req.headers['x-source']) {
      return res.json({success: false, message: 'Missing headers!'})
    }

    // Get the request url
    let url = req.baseUrl

    // For any non auth url's do some validation (security)
    if (!url.startsWith('/api/authenticate')) {

      let source = req.headers['x-source']

      // If mobile - do checks
      if (source === 'mobile') {

        if (!mobileUrls.includes[url]) {
          return res.json({success: false, message: 'Unable to access resource!'})
        }

      // If portal - do checks 
      } else if (source === 'portal') {

        if (!req.headers['x-token'] || !req.headers['x-user']) {
          return res.json({success: false, message: 'Missing headers!'})
        }

        // Check the token against the user
        let token = req.headers['x-token']
        let user = req.headers['x-user']

        let isTokenValid = await this.tokenService.validateToken(user, token)

        if (!isTokenValid) {
          return res.json({success: false, message: 'Invalid token!'})
        }

      // Unknown source
      } else {
        return res.json({success: false, message: 'Unknown source!'})
      }
    }

    next()
  }
}
