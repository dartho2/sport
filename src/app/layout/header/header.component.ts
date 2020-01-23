import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from 'src/app/_services';
import { User, Role } from '../../_models';
import { first } from 'rxjs/operators';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    loading = false;
    currentUser: User;
    userFromApi: User;
    constructor(
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }
    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}


