import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../admin/shared/shared.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HeaderService } from './layout.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { AnalysticService } from 'src/app/admin/analystic/analystic-service';
interface CategoryMatches {
  name: string;
  count: number;
  tournament?: CategoryMatchesTree[],
  values?: CategoryMatches[];
}
interface CategoryMatchesTree {
  name: string;
  count: number;
}
//  TREE BEGIN 
const TREE_DATA: CategoryMatches[] = [];

/** Flat node with expandable and level information */
interface CategoryMatchesFlat {
  expandable: boolean;
  name: string;
  flag: string;
  values?: Match[];
  count: any;
  level: number;
}
interface Match {
  name: string;
  values?: Match[]
  id: number;
  countEvent: number;
  flag: string;
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  // BEGIN TREE


  treeControl = new NestedTreeControl<Match>(node => node.values);

  dataSourceMatches = new MatTreeNestedDataSource<CategoryMatchesFlat>();
  // END TREE
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
  myDate: Date;
  formattedDate: string;
  resultBet = 1;
  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private analysticService: AnalysticService,
    private media: MediaMatcher, private headerService: HeaderService) {

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.headerService.filter.subscribe((filter: any) => {
      this.dataSourceMatches.data = filter;
    })
    this.headerService.lique.subscribe((lique: any) => {
      this.liqueId = lique
    })

  }

  hasChild = (_: number, node: CategoryMatchesFlat) => !!node.values && node.values.length > 0;

  ngOnInit(): void {
    this.myDate = new Date();
    this.formattedDate = formatDate(this.myDate, this.format, 'en');
  }
  betAllRateResultsMinus(x) {
    let a = 1;
    if (x.type.length <= 1) {
      x.type === '1' ? this.betAllRateResult /= x.vot1 : x.type === '2' ? this.betAllRateResult /= x.vot2 : x.type === 'X' ? this.betAllRateResult /= x.votX : '';
    } else {
      x.type === '1X' ? this.betAllRateResult /= x.vot1_d : x.type === 'X2' ? this.betAllRateResult /= x.vot2_d : x.type === '12' ? this.betAllRateResult /= x.votX_d : '';
    }
    return (a / 1.14).toFixed(2)
  }

  betRate(type, v1, vx, v2, v1_d, vx_d, v2_d) {
    switch (type) {
      case '1': return v1
      case '2': return v2
      case 'X': return vx
      case '1X': return v1_d
      case 'X2': return v2_d
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
  existMatchButton(id) {
    if (this.liqueId.indexOf(id) === -1) {
      return "black"
    } else {
      return "blue"
    }
  }
  deleted(index, bet) {
    this.dateEventsBet.events.splice(index, 1)
    this.checkPriceTotal()
    this.eventNumber = this.dateEventsBet.events.length
    this.headerService.subject.next({
      status: 70,
      statusChanged: 2,
      statusEvent: 2, events: this.dateEventsBet.events, last: bet
    });
  }
  saveBet() {
    this.dateEventsBet.events.forEach(x => {
      this.resultBet = this.resultBet * x.votePrice
    })

    this.dateEventsBet.rate = (this.resultBet / 1.14).toFixed(2)
    this.dateEventsBet.date = this.formattedDate

    this.analysticService.addEvents(this.dateEventsBet).subscribe(xresum => {
      this.dateEventsBet.events.forEach(x => {
        this.headerService.subject.next({
          status: 70,
          statusChanged: 2,
          statusEvent: 2, events: null, last: x
        });
      })
      this.eventNumber = 0;
      this.checkPriceTotal()

    })
    // console.log(this.dateEventsBet, "save /bet")
  }
  addID(id: number) {
    const index = this.liqueId.indexOf(id);
    if (index > -1) {
      this.liqueId.splice(index, 1);
      // console.log(this.myForm)
      // this.formbuilder()

      this.headerService.lique.next(this.liqueId)
    } else {
      this.liqueId.push(id)
      // this.formbuilder()
      this.headerService.lique.next(this.liqueId)
    }

  }
  checkPriceTotal() {
    this.votePrice = 1
    this.dateEventsBet.events.forEach(x => { this.votePrice *= x.votePrice })
  }
  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
    this.headerService.filter.subscribe((filter: any) => {
      this.dataSourceMatches.data = filter;
    })
    // this.headerService.lique.subscribe((lique :any)=>{
    //   this.liqueId = lique
    // })
    this.headerService.subject.subscribe((event: any) => {

      this.dateEventsBet = event;
      this.checkPriceTotal()
      this.eventNumber = this.dateEventsBet.events.length
    })
    // this.headerService.subject1.subscribe((result: any) => {
    //   this.betAllRateResult = 0;
    // })
  }
}
