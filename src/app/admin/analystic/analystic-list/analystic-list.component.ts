import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { AnalysticService } from '../analystic-service'
import { formatDate } from '@angular/common';
import { Analystic } from '../analystic.model';
import { map, reduce } from 'rxjs/operators';
import { exportData } from "../../products/export/exportData";
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface PeriodicElement {
  name: string;
  time: string;
  startTime: string;
  vote1: number;
  form: string;
  choice: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-analystic-list',
  templateUrl: './analystic-list.component.html',
  styleUrls: ['./analystic-list.component.css'],
  providers: []
})
export class AnalysticListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['type', 'flag', 'time', 'name', 'vote1', 'votex', 'vote2', 'kurs1', 'kursx', 'kurs2', 'chance1', 'chance2', 'MVC1', 'MVCx', 'MVC2', 'chanceEventDraw', 'homeForm', 'awayForm', 'status', 'result', 'homeChance25+', 'awayChance25+', 'homeChance25-', 'awayChance25-', '25chance', 'yellowCard', 'redCard'];

  @Input()
  eventID;
  chance = 0;
  formattedDate;
  awayYellow;
  homeYellow;
  myDate
  format = 'yyyy-MM-dd';
  actualformat = "dd.MM.yyyy"
  myNewDate;
  matchData = [];
  matchFootball;
  sportItem;
  stringData;
  percentChance = 70;
  startTimestamp;
  ClickCounter = 0;
  totalWin = 0;
  totalMatch = 0;
  totalWinTotal = 0;
  indexWin = 0
  win = 0;
  eventTournament;
  MaxVote;
  chanceChanged;
  amountChanged;
  draw;
  typeForVote;
  typeForPercent;
  amount;
  model1;
  mymodel;
  typPercent;
  teamRating;
  voteWinValue = [];
  voteWinSum = 0;
  voteWinAVG = 0;
  calculateWinner = 0;
  lose = 0;
  away = "away";
  home = "home";
  matchInfoMore25Goals = "More than 2.5 goals";
  matchInfowins = "Wins";
  matchInfoNoLosses = "No losses";
  matchInfoBothScore = "Both teams scoring";
  matchInfoFirstScore = "First to score";
  matchInfoNoWins = "No wins";
  matchInfoNoLose = "No losses";
  matchInfoNoGoals = "No goals conceded";
  matchInfoWithoutCleanSheet = "Without clean sheet";
  matchInfoLess25Goals = "Less than 2.5 goals";
  matchInfoFirstHalfWinner = "First half winner";
  colorWin = 'none';
  colorText = 'none';
  ligueId = [1, 36, 42, 33, 39, 52, 53, 62, 38, 202]
  statusCode = [100]
  votePrice;
  VotePrice: number;
  winSure = 0;
  winSureAll = 0;
  returnCost: number;
  numberPercent = 70;
  checkWins: string;
  myForm: FormGroup;
  dataSource = new MatTableDataSource(this.matchData);
  constructor(private analysticService: AnalysticService, private _fb: FormBuilder) {
    this.myNewDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.stringData = +new Date()
    
    this.myDate = new Date();
    this.myDate.setDate(this.myDate.getDate());
    this.formattedDate = formatDate(this.myDate, this.format, 'en');
    this.getMatches();
    this.myForm = this._fb.group({
      date: new FormControl(''),
      events: new FormArray([



      ])
    })

  }
  get events() { return this.myForm.get('events') as FormArray }

  exportTable() {
    exportData.exportToExcel("ExampleTable");
  }
  setCities(events, turnament) {
    let control = <FormArray>this.myForm.controls.events;

    control.push(this._fb.group({
      name: events.name ? events.name : '',
      type: '',
      typeYT: '',
      typeBT: '',
      typeVI: '',
      home: events.homeTeam.name,
      away: events.awayTeam.name,
      date: events.formatedStartDate ? events.formatedStartDate : '',
      dateControl: this.formattedDate,
      league: turnament.tournament.name,
      idEvent: events.id,
      win: events.win,
      vot1: events.vot1,
      votX: events.votX,
      vot2: events.vot2
    }))

  }

  captureScreen(formattedDate) {
    var data = document.getElementById('ExampleTable');
    html2canvas(data).then(canvas => {
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      pdf.autoTable({ html: '#ExampleTable', headStyles: { textColor: [76, 76, 76] }, styles: { halign: 'center', fillColor: [236, 236, 236], lineColor: "black", lineWidth: 0.1, fontSize: 6, overflow: 'visible', cellWidth: 'auto' }, });
      pdf.autoTable({ html: '#ExampleTable1', headStyles: { textColor: [76, 76, 76] }, styles: { halign: 'center', fillColor: [236, 236, 236], lineColor: "black", lineWidth: 0.1, fontSize: 6, overflow: 'visible', cellWidth: 'auto' }, });
      pdf.save('Mecze' + formattedDate + '.pdf'); // Generated PDF   
    });
  }
  getMatches() {
    this.matchData = [];
    this.analysticService.getAnalystict(this.formattedDate).pipe(map(res => {
      res.map(turnaments => {
        if (this.ligueId.includes(turnaments.tournament.id)) {


          turnaments.events.forEach(events => {

            let keys = []
            if (this.checkeventsExists(events.formatedStartDate, this.formattedDate)) {


              this.analysticService.getAnalystictEvent(events.id).subscribe(
                eventsData => {
                  this.eventTournament = eventsData;
                  // console.log(this.eventTournament)
                  this.analysticService.getVotePrice(events.id).subscribe(
                    vote => {
                      events["vote"] = vote.markets[0];
                      events["turnament"] = turnaments.category;
                      if (events["statusDescription"].includes('AP')) {
                        events["eventsWinAP"] = this.checkWin(eventsData, false, "win")
                        events["eventsWinFT"] = this.checkWin(eventsData, true, "win")
                      } else {
                        events["eventsWinFT"] = this.checkWin(eventsData, true, "win")
                      }
                      // events["eventsYelHome"] = this.checkWin(eventsData, this.home, "yellow")
                      // events["eventsYelAway"] = this.checkWin(eventsData, this.away, "yellow")
                      events["matchInfoMore25GoalsAway"] = this.away2Halfmore(eventsData, this.matchInfoMore25Goals, this.away)
                      events["matchInfoMore25GoalsHome"] = this.away2Halfmore(eventsData, this.matchInfoMore25Goals, this.home)

                      events["matchInfoLess25GoalsAway"] = this.away2Halfmore(eventsData, this.matchInfoLess25Goals, this.away)
                      events["matchInfoLess25GoalsHome"] = this.away2Halfmore(eventsData, this.matchInfoLess25Goals, this.home)

                      // events["matchInfoMore25GoalsHome"] = this.away2Halfmore(eventsData, this.matchInfoMore25Goals, this.home)
                      // events["eventsWin"] = this.checkWin(eventsData)
                      events["events"] = eventsData;
                      events["liveResults"] = this.liveFilter(eventsData, events["status"].code)
                      events["chanceEvent"] = this.calculateChance(events["events"], events["events"].winningOdds)
                      events["chanceEventDraw"] = this.calculateChanceWin(events["events"], events["events"].winningOdds)
                      events["chanceEventVote"] = this.calcuateVoteChance(events["events"])
                      events["h2hDuel"] = this.calculateH2hDuel(events["events"].h2hDuel)
                      events["chanceEvent"] === events["chanceEventVote"] && events["chanceEventVote"] === events["h2hDuel"] ? events["win"] = events["h2hDuel"] : '';
                      if (vote.markets[0]) {
                        if (vote.markets[0].choices[0].fractionalValue) {
                          events["vot1"] = this.calculateValueChance(vote.markets[0].choices[0].fractionalValue)
                        }
                        events["votX"] = this.calculateValueChance(vote.markets[0].choices[1].fractionalValue)
                        events["vot2"] = this.calculateValueChance(vote.markets[0].choices[2].fractionalValue)
                      }
                      if ([1, 2, 3].includes(events.winnerCode)) {
                        this.totalMatch += 1;
                        if (events["win"] !== undefined && events.winnerCode !== undefined) {
                          this.totalWinTotal += 1

                          if (events["win"] === 1) {
                            if (events["winnerCode"] === 1) {
                              if (events["vote"].length > 0) {
                                this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[0].fractionalValue))
                                this.voteWinSum = 0;
                                this.voteWinValue.forEach(x => {
                                  this.voteWinSum += parseFloat(x)
                                })
                              }
                            }
                          }
                          if (events["win"] === 2) {
                            if (events["winnerCode"] === 2) {
                              if (events["vote"]) {
                                this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[2].fractionalValue))
                                this.voteWinSum = 0;
                                this.voteWinValue.forEach(x => {
                                  this.voteWinSum += parseFloat(x)
                                })
                              }
                            }


                          }
                          if (events["win"] === 0) {
                            if (events["winnerCode"] === 3) {
                              if (events["vote"]) {
                                this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[1].fractionalValue))
                                this.voteWinSum = 0;
                                this.voteWinValue.forEach(x => {
                                  this.voteWinSum += parseFloat(x)
                                })
                              }
                            }
                          }
                          this.voteWinAVG = (this.voteWinSum / this.voteWinValue.length);

                        }
                        if (events.winnerCode === 3) {
                          const winerCodeChange = 0;
                          if ([events["chanceEvent"], events["h2hDuel"], events["chanceEventVote"]].includes(winerCodeChange)) {
                            this.totalWin += 1
                          }
                          events["win"] === winerCodeChange ? this.indexWin += 1 : '';

                        }
                        if (events.winnerCode === 2) {
                          const winerCodeChange = 2
                          if ([events["chanceEvent"], events["h2hDuel"], events["chanceEventVote"]].includes(winerCodeChange)) {
                            this.totalWin += 1
                          }
                          events["win"] === winerCodeChange ? this.indexWin += 1 : '';
                        }
                        if (events.winnerCode === 1) {
                          const winerCodeChange = 1
                          if ([events["chanceEvent"], events["h2hDuel"], events["chanceEventVote"]].includes(winerCodeChange)) {
                            this.totalWin += 1
                          }
                          events["win"] === winerCodeChange ? this.indexWin += 1 : '';
                        }
                      }
                      if (this.totalMatch === 0) {
                        let winALL = 1;
                        this.winSureAll = Number(((this.totalWin * 100) / winALL).toFixed(0))
                      } else {
                        this.winSureAll = Number(((this.totalWin * 100) / this.totalMatch).toFixed(0))
                      }
                      if (this.indexWin === 0) {
                        let win = 1;
                        this.winSure = Number(((win * 100) / this.totalWinTotal).toFixed(0))
                      } else {
                        this.winSure = Number(((this.indexWin * 100) / this.totalWinTotal).toFixed(0))
                      }
                      if (this.voteWinAVG, this.indexWin, this.totalWinTotal) {
                        this.returnCost = (((2 * this.voteWinAVG) * this.indexWin) / 1.14) - (this.totalWinTotal) * 2 // stawka 2 
                      }

                      keys.push(events)
                      this.matchData.push(...keys)
                      this.setCities(events, turnaments)
                      this.dataSource.data = this.matchData
                      this.dataSource.sort = this.sort;
                    }
                  )
                }
              )

            }
          })

        }
      })

    }))
      .subscribe(
        data => {
          this.matchFootball = data;
          console.log(this.matchData)
          // this.dataSource.data = this.matchData

          console.log(this.dataSource)
        })
  }
  checkChance25Goal(homeV, homeO, awayV, awayO) {
    let homeW;
    let awayW;
    if (homeV && awayV) {
      (homeO - homeV) <= 1 ? homeW = true : homeW = false;
      (awayO - awayV) <= 1 ? awayW = true : awayW = false;
      if (awayW && homeW) {
        return '2,5+'
      }
    }
  }
  away2Halfmore(data, name, team) {
    if (data.matchInfo.general !== undefined) {
      let c = data.matchInfo.general.filter(x => x.name === name && x.team === team)[0]
      if (c) {
        let b = Object.assign(c)
        return b
      }


    }
  }
  liveFilter(dataFilter, status) {

    if (dataFilter.incidents.length > 0 && (status === 6 || status === 7 || status === 31)) {

      let a = dataFilter.incidents.filter(x => x.homeScore)
      if (a.length) {
        return a[0].homeScore + '-' + a[0].awayScore
      } else {
        return '0-0'
      }
    } else {
      if (status === 6 || status === 7 || status === 31) {
        return '0-0'
      }
    }
    // if(a.length >0){
    //   return a[0].homeScore + '-'+ a[0].awayScore
    // }else{
    //   return '0-0'
    // }
  }
  checkWin(incident, typeWin, formatData) {
    this.checkWins = '';
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
  onWinhange(price) {
    this.returnCost = (((price * this.voteWinAVG) * this.indexWin) / 1.14) - (this.totalWinTotal) * price
  }
  getColor(voteWinAVG) {
    if (voteWinAVG > 70) { return 'green' } else { return 'red'; }

  }
  calculateH2hDuel(h2hDuel) {

    const max = Math.max(...[Number(h2hDuel.awaywins), Number(h2hDuel.homewins), Number(h2hDuel.draws)]);

    if (max === h2hDuel.awaywins) {
      return 2
    } else {
      if (max === h2hDuel.homewins) {
        return 1
      } else {
        return 0
      }
    }
  }
  calcuateVoteChance(eventTournament) {
    if (eventTournament !== undefined) {
      this.MaxVote = Math.max.apply(null, [eventTournament.vote.vote1Percentage, eventTournament.vote.voteXPercentage, eventTournament.vote.vote2Percentage]);
      this.typeForVote = ((eventTournament.vote.vote1Percentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.vote1Percentage) :
        ((eventTournament.vote.voteXPercentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.voteXPercentage) :
          ((eventTournament.vote.vote2Percentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.vote2Percentage) : 0;
      this.typeForVote > this.numberPercent ? (this.typPercent = this.typeForVote) : 3; //typPercent powyzej 70
      this.typeForVote = ((eventTournament.vote.vote1Percentage * 100) === (this.typPercent * 100)) ? 1 :
        ((eventTournament.vote.voteXPercentage * 100) === (this.typPercent * 100)) ? 0 :
          ((eventTournament.vote.vote2Percentage * 100) === (this.typPercent * 100)) ? 2 : 0;
      return this.typeForVote

    }
  }
  calculateChanceWin(eventTournament, vote) {
    if (vote.length !== 0 && (vote.home !== undefined || vote.away !== undefined)) {
      const home = (vote.home !== undefined) ? vote.home.actual : 0;
      const away = (vote.away !== undefined) ? vote.away.actual : 0;
      const numberMax = Math.max.apply(null, [away, home]);
      const numberMin = Math.min.apply(null, [away, home]);
      const different = numberMax - numberMin;
      if (different < 15) {
        return 0
      } else {
        return null
      }
    }
  }
  calculateChance(eventTournament, vote) {
    if (vote.length !== 0 && (vote.home !== undefined || vote.away !== undefined)) {
      const home = (vote.home !== undefined) ? vote.home.actual : 0;
      const away = (vote.away !== undefined) ? vote.away.actual : 0;
      const numberMax = Math.max.apply(null, [away, home]);
      const numberMin = Math.min.apply(null, [away, home]);
      const different = numberMax - numberMin;
      if (home !== 0) {

        if (home === numberMax) {
          if (numberMax > 70) {

            return 1
          } else {
            return 0
          }
        } else {
          if (numberMax > 70) {
            return 2
          } else {
            return 0

          }
        }
      } else {
        if (away !== 0) {
          return away === numberMax ? 2 : 1;
        } else
          return 0
      }

    } else {
      return ""
    }
  }
  calculateWinningOdds(vote) {



  }





  checkeventsExists(dataEvent, data) {
    if (dataEvent.slice(0, -1) === formatDate(data, this.actualformat, 'en')) {
      return true
    } else {
      return false
    }
  }
  changePercent(x) {
    // this.getMatches(x)
  }
  onSubmitForm(f) {
    console.log(this.myForm.value)
    var dateEvents = {date: '', events:[]}
this.myForm.value.events.forEach(x=> {
      if(x.name && (x.type || x.typeBT || x.typeYT || x.typeVI)){
        dateEvents.date = this.formattedDate
        dateEvents.events.push(x)
      }
    })
    if(dateEvents.events.length > 0 ){
      // dateEvents["name"](dateEvents.events[0].dateControl)
      console.log(dateEvents)
      this.analysticService.addEvents(dateEvents).subscribe(x=> {
      console.log(x)
    })
    }
    
  }
  onSubmit(event) {
    this.numberPercent = event
    this.voteWinAVG = 0;
    this.voteWinValue = [];
    this.winSureAll = 0;
    this.totalWin = 0;
    this.winSure = 0;
    this.totalMatch = 0;
    this.totalWinTotal = 0;
    this.indexWin = 0
    this.getMatches()
  }
  onSearchChange(data) {
    this.voteWinAVG = 0;
    this.voteWinValue = [];
    this.winSureAll = 0;
    this.totalWin = 0;
    this.winSure = 0;
    this.totalMatch = 0;
    this.totalWinTotal = 0;
    this.indexWin = 0
    data.setDate(data.getDate());
    this.formattedDate = formatDate(data, this.format, 'en');
    this.stringData = this.formattedDate

    this.getMatches();
  }
  calculateValueChance(value) {

    if (value) {
      return (eval(value) + 1).toFixed(2)
    }


  }
  onchanceChanged(amount: number) {
    this.chance = this.chance + amount
  }


  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource(this.matchData);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'flag': return item.turnament.flag;
        case 'time': return item.startTime;
        case 'vote1': return item.events.vote.vote1Percentage;
        case 'votex': return item.events.vote.voteXPercentage;
        case 'vote2': return item.events.vote.vote2Percentage;
        // case 'kurs1':  if(item.vote){return this.calculateValueChance(item.vote.choices[0].fractionalValue)};
        // case 'kursx':  if(item.vote){return this.calculateValueChance(item.vote.choices[1].fractionalValue)};
        // case 'kurs2':  if("undefined" === typeof(item.vote.choices[2].fractionalValue)){return this.calculateValueChance(item.vote.choices[2].fractionalValue)};
        case 'chance1': if (item.events.winningOdds.home !== undefined) { return item.events.winningOdds.home.actual };
        case 'chance2': if (item.events.winningOdds.away !== undefined) { return item.events.winningOdds.away.actual };
        case 'header-row-status-group': return item.win

        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;

  }
  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}