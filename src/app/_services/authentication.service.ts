﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Api } from '../_models';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserSubjectApi: BehaviorSubject<Api>;
    public currentUser: Observable<User>;
    public currentUserApi: Observable<Api>;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUserSubjectApi = new BehaviorSubject<Api>(JSON.parse(localStorage.getItem('currentUserApi')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserApi = this.currentUserSubjectApi.asObservable();
    }
    
    public get currentUserValueApi(): Api {
        return this.currentUserSubjectApi.value;
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/users/authenticate`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }
    //  REST_API
    loginAPI(login: string, password: string) {
        return this.http.post<any>(`https://api.e-bidfood.pl/api/v1/auth/login`, { login, password })
            .pipe(map(user => {
                console.log(user, "bid user")
                // login successful if there's a jwt token in the response
                if (user && user.auth_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUserApi', JSON.stringify(user));
                    this.currentUserSubjectApi.next(user);
                }

                return user;
            }));
    }
    logoutApi() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUserApi');
        this.currentUserSubjectApi.next(null);
    }
}