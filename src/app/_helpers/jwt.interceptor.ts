import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        const isApiUrlApi = request.url.startsWith("https://api.e-bidfood.pl/");
        const currentUserApi = this.authenticationService.currentUserValueApi;
        const isLoggedInApi = currentUserApi && currentUserApi.auth_token;
        // console.log(isApiUrl, "isApiUrl", isApiUrlApi, "isApiUrlApi")
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        if (isLoggedInApi && isApiUrlApi) {
            
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUserApi.auth_token}`
                }
            });
            
        }

        return next.handle(request);
    }
}