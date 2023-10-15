import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  private myLogget = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {  
    const http = context.switchToHttp();
    const request = http.getRequest();
    this.myLogget.log(`Method: ${request.method} | URL: ${request.url}` );
    return next.handle();
  }
}
