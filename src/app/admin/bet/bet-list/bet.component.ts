import { Component, OnInit, ViewChild } from '@angular/core';
import { BetServiceComponent } from '../bet-service'
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AnalysticService } from '../../analystic/analystic-service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Bet } from '../bet.model'
import { map } from 'rxjs/operators';
import { CompileTemplateMetadata } from '@angular/compiler';
const ELEMENT_DATA: Bet[] = [];
@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BetComponent implements OnInit {
  displayedColumns: string[] = ['status', 'date', 'kurs', 'rate'];
  bets;
  event: any;
  dupa;
  panelOpenState = false;
  dataSource = new MatTableDataSource<Bet>(ELEMENT_DATA);
  newEvents;
  expandedElement: any;
  checkWins = '';
  updateCupon:any = [];
  constructor(
    private betService: BetServiceComponent,
    private analysticService: AnalysticService,
    private route: ActivatedRoute,
    private router: Router) {
  }
  statusEvent(event) {
    console.log(event, "-event")

  }
  checkAllWins(match) {
    if (match.indexOf(0) !== -1) {
      return 0
    } else {
      if (match.indexOf(2) !== -1) {
        return 2
      } else {
        return 1
      }
    }
  }
  checkAll(win) {

    if ([0].includes(win)) {
      return 0
    } else {
      if ([2].includes(win)) {
        return 2
      } else {
        return 1
      }
    }
  }
  editDataMatch(match) {

    if (Number(match.win) === Number(match.type)) {
      return 1 //wygrana
    } else {
      if (Number(match.win) === 0) {
        return 2 //nierozstrzygniete
      } else {
        return 0 //przegrana
      }
    }
  }
  editData(event) {
    // 1 wygrana 1, 2 wygrana 2, 3 remis, 0 brak
    let result = []
    event.events.map(x => {
      if (Number(x.win) === Number(x.type)) {
        result.push(1) //wygrana
      } else {
        if (Number(x.win) === 0) {
          result.push(2) //nierozstrzygniete
        } else {
          result.push(0) //przegrana
        }
      }
    })
    return result
  }
  checkCup(element) {
    console.log(element[0].status, element[1].status, "dasd")
    element.forEach(x => {
      x.events.forEach(y => {
        if (x['winers'] !== 0) {
          if (Number(y.type) !== y.win) {
            if (y.win !== 0) {
              x['winers'] = 0
            } else {
              x['winers'] = 3
            }
          } else {
            x['winers'] = 1
          }
        }

      })
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
  checki(expandedElement, element) {
    if (this.expandedElement !== element) {
      this.expandedElement = element
    } else {
      this.expandedElement = null
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
  betCoupon(event) {
    let statusChanged = []
    for (let index = 0; index < event.events.length; index++) {
      statusChanged.push(event.events[index].win)
    }
    if (statusChanged.includes(0)) {
      return 0
    } else {
      return 1
    }
  }
  betWin(event) {
    let win = 1
    for (let index = 0; index < event.events.length; index++) {
      if (event.events[0].win) {
        if (event.events[0].type === event.events[0].win.toString()) {

        } else {
          win = 0
        }

      }
    }
    return win

  }
  getBet(){
   
  }
  ngOnInit() {
    this.updateCupon = this.betService.getBetAll().subscribe(res => {
      this.bets = res
      console.log(this.bets[1].status, "bets")
       this.bets.map((ev,index) => {
        let wins = []
        if (ev.statusChanged === 2) {
          ev.events.map(t => {
            if (!t.statusCode) {
              this.analysticService.getAnalystictEvent(t.idEvent).subscribe(even => {
                if (even.winnerCode !== 0) {
                  t.type = t.type.replace("X", "3")
                  if (t.type.includes(even.event.winnerCode)) {
                    t.statusCode = true
                    t.winnerCode = true
                    this.bets[index].status = 60
                  } else {
                    t.statusCode = true
                    t.winnerCode = false
                  }
                }
              })
            }
          })
        }
       
      
        // console.log("update ", ev)
        // if (ev.status === 60) {
        //   console.log("update")
        //   ev.status = 70
        //   this.betService.updateBet(ev).subscribe(result => {
        //     console.log(result)
        //   })
        // }
      })

      this.checkCup(this.bets)
      this.dataSource.data = this.bets

    })
    // this.updateCupon.forEach(x=> {
    //   console.log(x.status)
    // })
    console.log(this.bets, "status")
  }


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

}
