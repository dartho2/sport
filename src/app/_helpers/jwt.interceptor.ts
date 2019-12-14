import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        // const token = this.authenticationService.checkToken(currentUser)
        if (currentUser) {
            request = request.clone({
                setHeaders: { 
                    'Content-Type': 'application/json',
                    token: `${currentUser}`
                }
            });
        }

        return next.handle(request);
    }
}
