import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NgrokInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clona a requisição e adiciona o header que pula o aviso do ngrok
    const ngrokReq = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return next.handle(ngrokReq);
  }
}
