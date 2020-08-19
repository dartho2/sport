import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../admin/shared/shared.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { HeaderService } from './layout.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
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
  count: any;
  level: number;
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  // BEGIN TREE
  private _transformer = (node: CategoryMatches, level: number) => {
    return {
      expandable: !!node.values && node.values.length > 0,
      name: node.name,
      length: node.values,
      count: node,
      tournament: node.tournament,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<CategoryMatchesFlat>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.values);

  dataSourceMatches = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
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

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private media: MediaMatcher, private headerService: HeaderService) {
    this.dataSourceMatches.data = TREE_DATA;
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
  hasChild = (_: number, node: CategoryMatchesFlat) => node.expandable;
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
  existMatchButton(id) {
    if (this.liqueId.indexOf(id) === -1) {
      return "color: rgba(0,0,0,.87);"
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
  addID(id:number){
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
