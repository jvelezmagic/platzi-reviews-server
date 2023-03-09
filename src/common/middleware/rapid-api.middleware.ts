import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class RapidApiSecretMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: any) {
    const proxySecretHeader = req.headers['x-rapidapi-proxy-secret'];
    const proxySecret = process.env.RAPID_API_SECRET;

    if (!proxySecretHeader || proxySecretHeader !== proxySecret) {
      res.statusCode = HttpStatus.UNAUTHORIZED;

      // TODO: Find a way to return a JSON response in the graphQL context
      // instead of throwing an exception
      throw new UnauthorizedException('Unauthorized');
    }
    next();
  }
}
