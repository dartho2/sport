import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AuthenticationService, UserService } from 'src/app/_services';
import { User, Role } from '../../../_models';
import { Router, ActivatedRoute , ParamMap } from '@angular/router';
import { formatDate } from '@angular/common';
import { AnalysticListComponent } from "../../../admin/analystic/analystic-list/analystic-list.component";
@Component({
  selector: 'app-navbar-sport',
  templateUrl: './navbar-sport.component.html',
  styleUrls: ['./navbar-sport.component.css']
})
export class NavbarSportComponent implements OnInit, AfterViewInit {
  @ViewChild(AnalysticListComponent, {static: false}) childRef;
  @ViewChild('drawer', {static: false}) drawer: any;
  exampleParent: string;
  status: boolean = false;
  loading = false;
  currentUser: User;
  mymodel;
  userFromApi: User;
  activated: boolean;
  format = 'yyyy-MM-dd';
  public selectedItem: string = '';
  
  userSubscription: Subscription;
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: BreakpointState) => result.matches));
    
  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute , private router: Router,private userService: UserService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  //   this.route.paramMap.subscribe((paramMap: ParamMap) => {
  // })
}
league: any = [];
ngAfterViewInit(){
  console.log(this.childRef)
      this.exampleParent = this.childRef.exampleChild
}
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }
  onSearchChangeParam(data) {
    this.router.navigate(['analystic/list/', formatDate(data, this.format, 'en')])
  }
  toogleNav() {
    this.status = !this.status;
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

