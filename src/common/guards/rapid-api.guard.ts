import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RapidApiGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const proxySecretHeader = req.headers['x-rapidapi-proxy-secret'];
    const proxySecret = this.configService.get<string>('rapidApiKey');

    if (!proxySecretHeader || proxySecretHeader !== proxySecret) {
      return false;
    }

    return true;
  }
}
