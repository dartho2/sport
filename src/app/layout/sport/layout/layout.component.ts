import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../admin/shared/shared.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HeaderService } from './layout.service';


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
    mymodel;
    eventNumber: number;
    betAllRateResult: any = null;
    private autoLogoutSubscription: Subscription;
    dateEventsBet: any = null;

    constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router,
        private media: MediaMatcher,private headerService: HeaderService) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {

    }
    betAllRateResultsMinus(x) {
      let a = 1;
      if (x.type.length <= 1) {
        x.type === '1' ? this.betAllRateResult /= x.vot1 : x.type === '2' ? this.betAllRateResult /= x.vot2 : x.type === '0' ? this.betAllRateResult /= x.votX : '';
      } else {
        x.type === '10' ? this.betAllRateResult /= x.vot1_d : x.type === '02' ? this.betAllRateResult /= x.vot2_d : x.type === '12' ? this.betAllRateResult /= x.votX_d : '';
      }
      return (a / 1.14).toFixed(2)
    }
   
    betRate(type, v1, vx, v2, v1_d, vx_d, v2_d) {
      switch (type) {
        case '1': return v1
        case '2': return v2
        case '0': return vx
        case '10': return v1_d
        case '02': return v2_d
        case '12': return vx_d
      }
  
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
        this.headerService.subject.subscribe((event: any) => {
          this.dateEventsBet = event;
         this.eventNumber = this.dateEventsBet.events.length
        })
        this.headerService.subject1.subscribe((result: any) => {
          this.betAllRateResult = result;
        })
    }
}
