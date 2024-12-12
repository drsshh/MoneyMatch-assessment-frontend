import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class RestInterceptor implements HttpInterceptor {
  constructor(
  ) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const targetUrl = req.clone({
      url: `http://localhost:8080${req.url}`,
    });

    return next.handle(targetUrl);
  }
}
