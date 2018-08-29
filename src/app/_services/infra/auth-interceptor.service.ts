import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, GraphUrl } from '@services/msgraph';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
    if (token == null) { return next.handle(req); }
    if (token.access_token == null) { return next.handle(req); }

    // ne change le header que si l'URL commence par https://graph.microsoft.com/v1.0/ définie dans la constante GraphUrl
    if (!req.url.startsWith(GraphUrl)) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers:
        req.headers
          .set('Authorization', 'Bearer ' + token.access_token)
          .set('Content-Type', 'application/json')
    });

    return next.handle(authReq);
  }
}
