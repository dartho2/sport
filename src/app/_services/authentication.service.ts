import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    checkToken(token) {
     return this.http.get<any>(`https://karmazdrowia.pl:8080/api/validate_token`).subscribe(token => { 
     return token
     })
    }
    login(user: string, password: string) {
        return this.http.post<any>(`https://karmazdrowia.pl:8080/api/auth/login`, { user, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user) {
                    // console.log("user", user)
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
        this.currentUserSubject.next(null);
    }
}