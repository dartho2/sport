import { Component, OnInit, ViewChild } from '@angular/core';
import { BetServiceComponent } from '../bet-service'
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AnalysticService } from '../../analystic/analystic-service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Bet } from '../bet.model'
import { map } from 'rxjs/operators';
const ELEMENT_DATA: Bet[] = [];
@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BetComponent implements OnInit {
  displayedColumns: string[] = ['status','date','rate'];
  bets;
  event: any;
  dupa;
  panelOpenState = false;
  dataSource = new MatTableDataSource<Bet>(ELEMENT_DATA);
  newEvents;
  expandedElement: any;
  checkWins= '';

  constructor(private betService: BetServiceComponent, private analysticService: AnalysticService, private route: ActivatedRoute, private router: Router, ) {

    this.betService.getBetAll().subscribe(res => {
      this.bets = res
      console.log(this.bets)
      this.bets.map(ev => {
        ev.events.map(t => {
          this.analysticService.getAnalystictEvent(t.idEvent).subscribe(even => { 
            if(t.type === "0"){
              t["type"] = "3"
            }
            t.win = even.event.winnerCode
            if (even.event["statusDescription"].includes('AP')) {
              t["eventsWinAP"] = this.checkWin(even, false, "win")
              t["eventsWinFT"] = this.checkWin(even, true, "win")
            } else {
              t["eventsWinFT"] = this.checkWin(even, true, "win")
            }
            if ([0, 1, 2, 3].includes(even.event.winnerCode)) {
              t["winCode"] = even.event.winnerCode.toString()
            }
            ev.status = this.betWin(ev)
            ev.statusChanged = this.betCoupon(ev)
            if( ev.statusChanged !== 1){
            this.betService.updateBet(ev).subscribe(dd => { console.log(dd) })
          }
          },
            err => {
              console.error(err);
            })
        })
      })
      this.dataSource.data =this.bets
    })



  }
  checkWin(incident, typeWin, formatData) {
    let checkWin = '';
    if (formatData === "win") {
      if (typeWin) {
        if (incident.incidents.length > 0) {
          // incident.incidents[0].text.includes('FT') ? this.checkWins = incident.incidents[0].text : "";
          incident.incidents.forEach(x => {
            if (x.time === 90 && x.text) {
              if (x.text.includes('FT')) {
                this.checkWins = x.text.replace('FT', '')
              }
            }
          }
          )
        }
      } else {
        if (incident.incidents.length > 0) {
          incident.incidents[0].text.includes('PEN') ? this.checkWins = incident.incidents[0].text.replace('PEN', '') : '';
        }
      }
      return this.checkWins
    }
    // LICZBA kartek
    // if(formatData === "yellow"){
    //   this.awayYellow = 0;
    //   this.homeYellow = 0;
    //   var a;
    //   typeWin === "home" ? a = true : a = false

    //     if (incident.incidents.length > 0) {
    //       incident.incidents.forEach(x => {
    //         if(x.type){
    //         if(a && x.type.includes('Yellow') && x.isHome === a){
    //           this.awayYellow += 1
    //       }
    //       if(!a && (x.type.includes('Yellow') && x.isHome === a)){
    //         this.awayYellow += 1
    //     }}
    //       })
    //     }

    //   return this.awayYellow
    // }
  }
  checki(expandedElement, element){
    if(this.expandedElement !== element){
     this.expandedElement = element}else{
      this.expandedElement =null
     }
  }
  // checkWinnerCode(events){
  //   switch(events) { 
  //     case 1: { 
  //       return 1
  //     } 
  //     case 2: { 
  //       return 2
  //     } 
  //     case 3: { 
  //       return 3
  //    } 
  //  } 

  // }
  betCoupon(event){
    let statusChanged = []
    for (let index = 0; index < event.events.length; index++) {
      statusChanged.push(event.events[index].win)
    }
    if(statusChanged.includes(0)){
      return 0
    } else{
      return 1
    }
  }
  betWin(event) {
    let win = 1
    for (let index = 0; index < event.events.length; index++) {
      if(event.events[0].win){
      if (event.events[0].type === event.events[0].win.toString()) {

      } else {
        win = 0
      }

    }}
    return win

  }
  ngOnInit() {}


  @ViewChild(MatPaginator) paginator: MatPaginator;

}
