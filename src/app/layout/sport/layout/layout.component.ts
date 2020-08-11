import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../admin/shared/shared.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean;
    format = 'yyyy-MM-dd';
  
    private autoLogoutSubscription: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router,
        private media: MediaMatcher) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {

    }
    onSearchChangeParam(data) {
      this.router.navigate(['analystic/list/', formatDate(data, this.format, 'en')])
    }
    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
  
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}
