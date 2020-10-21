import { Component, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AuthenticationService, UserService } from 'src/app/_services';
import { User, Role } from '../../_models';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { formatDate } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { fadeAnimation } from "../../admin/shared/animations/faderoute";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [fadeAnimation]
})
export class NavbarComponent implements OnInit {
  // BEGIN TREE

  @ViewChild('drawer', {static: false}) drawer: any;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean;
  format = 'yyyy-MM-dd';
  mymodel;
  votePrice = 1;
  eventNumber: number;
  filterDataGroup: any;
  betAllRateResult: any = null;
  private autoLogoutSubscription: Subscription;
  dateEventsBet: any = null;
  liqueId = [];
  status: boolean = false;
  loading = false;
  currentUser: User;
  userFromApi: User;
  activated: boolean;
  public selectedItem: string = '';
  userSubscription: Subscription;
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result: BreakpointState) => result.matches));

  constructor(private changeDetectorRef: ChangeDetectorRef, private breakpointObserver: BreakpointObserver, private router: Router,
    private media: MediaMatcher, private userService: UserService, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  ngOnInit(): void {
    this.loading = true;
    this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
      this.loading = false;
      this.userFromApi = user;
    });
    
  }

  onSearchChangeParam(data) {
    this.router.navigate(['analystic/list/', formatDate(data, this.format, 'en')])
  }
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);

  }
  existMatchButton(id) {
    if (this.liqueId.indexOf(id) === -1) {
      return "red"
    } else {
      return "blue"
    }
  }


  checkPriceTotal() {
    this.votePrice = 1
    this.dateEventsBet.events.forEach(x => { this.votePrice *= x.votePrice })
  }
  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();

  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  logoutApi() {
    this.authenticationService.logoutApi();
    this.router.navigate(['/settings/rest_api']);
  }

}

