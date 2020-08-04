import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
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
import { a, e } from '@angular/core/src/render3';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
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
  displayedColumns: string[] = ['time', 'type'];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input()
  eventID;
  panelOpenState;
  chance = 0;
  dateEventsBet = { date: '', status: 70, rate: "0", statusEvent: 2, statusChanged: 2, events: [] };
  formattedDate;
  awayYellow;
  betAllRateResult = 1;
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
  selected = -1;
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
  ligueId = [1, 4, 8, 13, 19, 36, 39, 42, 47, 33, 39, 52, 53, 62, 38, 679, 202, 7918, 1465, 33563]
  statusCode = [100]
  votePrice;
  VotePrice: number;
  turnamentEvent = [];
  radioVal;
  winSure = 0;
  winSureAll = 0;
  returnCost: number;
  numberPercent = 70;
  checkWins: string;
  public RadioOpts = [
    { id: '1', value: '1' },
    { id: '0', value: '0' },
    { id: '2', value: '2' }
  ];
  myForm: FormGroup;
  favoriteSeason: string;
  seasons: string[] = ['1', '2', '0'];

  currentCheckedValue = null;
  dataSource = new MatTableDataSource(this.matchData);
  dateALL: any;
  constructor(private analysticService: AnalysticService, private ren: Renderer2, private _fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.myNewDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.stringData = +new Date()

    this.myDate = new Date();
    this.myDate.setDate(this.myDate.getDate());
    this.formattedDate = formatDate(this.myDate, this.format, 'en');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("data")) {
        let data = paramMap.get("data");
        this.onSearchChange(new Date(data))
      } else {

      }
    })

    // this.getMatches();
    this.formbuilder();
  }
  fff() {

    // console.log(this.eventss)
  }
  checkState(el, type, con) {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
        el.checked = false;
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-program-focused');
        this.currentCheckedValue = null;
        this.favoriteSeason = null;
      } else {
        el.checked = true;
        this.currentCheckedValue = el.value

      }
    })
  }

  formbuilder() {
    this.myForm = this._fb.group({
      date: new FormControl(''),
      events: this._fb.array([

      ])

    })
  }

  get eventss() { return this.myForm.get('events') as FormArray }
  onCheckChange(event) {
    const formArray: FormArray = this.myForm.get('type') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else {
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }
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
      time: events.startTime,
      home: events.homeTeam.name,
      away: events.awayTeam.name,
      date: events.formatedStartDate ? events.formatedStartDate : '',
      dateControl: this.formattedDate,
      league: turnament.tournament.name,
      idEvent: events.id,
      win: events.win,
      vot1: events.vot1,
      votX: events.votX,
      vot2: events.vot2,
      vot1_d: events.vot1_d,
      votX_d: events.votX_d,
      vot2_d: events.vot2_d
    }))

  }
  onSelectionChange(a, b) {

  }
  clickRadio(event: Event, value: any, i) {
    // event.preventDefault();
    if (!this.radioVal || this.radioVal !== value) {
      this.radioVal = value;
      this.eventss.at(i).patchValue({ type: this.radioVal });
      return;
    }

    if (this.radioVal === value) {
      event.preventDefault();
      this.radioVal = 4;
      this.eventss.at(i).patchValue({ type: '' });
    }
  }

  isRadioSelected(value: any) {
    return (this.radioVal === value);
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
        this.turnamentEvent.push(turnaments.tournament.name);
        if (this.ligueId.includes(turnaments.tournament.id)) {
          this.analysticService.getMatches(turnaments.tournament.id, turnaments.season.id).subscribe(standing => {
            turnaments.events.forEach(events => {
              let keys = []
              if (this.checkeventsExists(events.formatedStartDate, this.formattedDate)) {
                events["standings"] = standing;

                Object.keys(events["standings"].teamEvents).forEach(key => {
                  if (Number(key) === Number(events.awayTeam.id)) {
                    events["standingsMatchesAway"] = this.sortData(events["standings"].teamEvents[key].total, events["standings"].teamEvents[key].away, events["standings"].teamEvents[key].home)
                    events["standingsWinAway"] = 0;
                    events["standingsDrawAway"] = 0;
                    events["standingsLosseAway"] = 0;
                    events["standingsMatchesAway"].forEach(win => {
                      if ((events.awayTeam.name === win.awayTeam.name) && win.winnerCode === 2) {
                        events["standingsWinAway"] = events["standingsWinAway"] + 1
                      }
                      if (win.winnerCode === 3) {
                        events["standingsDrawAway"] = events["standingsDrawAway"] + 1
                      }
                      if ((events.awayTeam.name === win.awayTeam.name) && win.winnerCode === 2) {
                        events["standingsLosseAway"] = events["standingsLosseAway"] + 1
                      }
                    })
                  }
                  if (Number(key) === Number(events.homeTeam.id)) {
                    events["standingsMatchesHome"] = this.sortData(events["standings"].teamEvents[key].total, events["standings"].teamEvents[key].away, events["standings"].teamEvents[key].home)
                    events["standingsWinHome"] = 0;
                    events["standingsDrawHome"] = 0;
                    events["standingsLosseHome"] = 0;
                    events["standingsMatchesHome"].forEach(win => {
                      if ((events.homeTeam.name === win.homeTeam.name) && win.winnerCode === 1) {
                        events["standingsWinHome"] = events["standingsWinHome"] + 1
                      }
                      if (win.winnerCode === 3) {
                        events["standingsDrawHome"] = events["standingsDrawHome"] + 1
                      }
                      if ((events.homeTeam.name === win.homeTeam.name) && win.winnerCode === 2) {
                        events["standingsLosseHome"] = events["standingsLosseHome"] + 1
                      }
                    })
                  }
                })
                // events["standings"].teamEvents.forEach((keys : any, vals :any)=>{

                // })
                this.analysticService.getAnalystictEvent(events.id).subscribe(
                  eventsData => {
                    this.eventTournament = eventsData;

                    this.analysticService.getEventsLast(events.awayTeam.id).subscribe(x => {
                      events["last"] = x
                    })
                    this.analysticService.getEventsNext(events.homeTeam.id).subscribe(x => {
                      events["next"] = x
                    })
                    this.analysticService.getVotePrice(events.id).subscribe(
                      vote => {

                        events["vote"] = vote.markets[0];
                        events["vote_double"] = vote.markets[1]
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
                        if (vote.markets[1]) {
                          if (vote.markets[1].choices[0].fractionalValue) {
                            events["vot1_d"] = this.calculateValueChance(vote.markets[1].choices[0].fractionalValue)
                          }
                          events["votX_d"] = this.calculateValueChance(vote.markets[1].choices[1].fractionalValue)
                          events["vot2_d"] = this.calculateValueChance(vote.markets[1].choices[2].fractionalValue)
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
          })
        }
      })

    }))
      .subscribe(
        data => {

          this.matchFootball = data;
        })
  }
  sort_unique(arr) {
    if (arr.length === 0) return arr;
    arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
      if (arr[i - 1].id !== arr[i].id) {
        ret.push(arr[i]);
      }
    }
    return ret;
  }
  sortData(total, home, away) {

    let a = [];
    a = [...total, ...home, ...away]
    //  a = a.sort(function(o){ return o });
    a = a.sort((a, b) => a.startTimestamp - b.startTimestamp);
    const reult = Array.from(new Set(a.map(s => s.id))).map(
      id => {
        return a.find(s => s.id === id)
      }
    )
    return reult

  }

  checkStandings(key, home) {
    if ((Number(key) === Number(home))) {
      return true
    } else {
      return false
    }
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
  betAllRateResultsMinus(x) {
    let a = 1;
    if(x.type.length <= 1){
    x.type === '1' ? this.betAllRateResult /= x.vot1 : x.type === '2' ? this.betAllRateResult /= x.vot2 : x.type === '0' ? this.betAllRateResult /= x.votX : '';
  } else {x.type === '10' ? this.betAllRateResult /= x.vot1_d : x.type === '02' ? this.betAllRateResult /= x.vot2_d : x.type === '12' ? this.betAllRateResult /= x.votX_d : '';
}
return (a / 1.14).toFixed(2)
  }
  betAllRateResults(x) {
    let a = 1;
    x.type === '1' ? this.betAllRateResult *= x.vot1 : x.type === '2' ? this.betAllRateResult *= x.vot2 : x.type === '0' ? this.betAllRateResult *= x.votX : '';
    x.type === '10' ? this.betAllRateResult *= x.vot1_d : x.type === '02' ? this.betAllRateResult *= x.vot2_d : x.type === '12' ? this.betAllRateResult *= x.votX_d : '';
  
    return (a / 1.14).toFixed(2)
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
    let stawka = 1;
    this.dateEventsBet.events.forEach(x => {
      if (x.name && (x.type.length > 0)) {
        if (x.type === "1") {
          stawka *= parseFloat(x.vot1)
        }
        if (x.type === "2") {
          stawka *= parseFloat(x.vot2)
        }
        if (x.type === "0") {
          stawka *= parseFloat(x.votX)
        }
      }
    })
    this.dateEventsBet.rate = stawka.toFixed(2)
    if (this.dateEventsBet.events.length > 0) {
      this.analysticService.addEvents(this.dateEventsBet).subscribe(x => {
      })

    }

  }
  onSubmit(event) {
    this.numberPercent = event
    this.voteWinAVG = 0;
    this.myForm.controls.events.reset();
    this.matchData = [];
    this.voteWinValue = [];
    this.winSureAll = 0;
    this.totalWin = 0;
    this.winSure = 0;
    this.totalMatch = 0;
    this.totalWinTotal = 0;
    this.indexWin = 0
    this.getMatches()
  }
  onSearchChangeParam(data) {
    this.router.navigate(['analystic/list/', formatDate(data, this.format, 'en')])
  }
  onSearchChange(data) {
    this.mymodel = formatDate(data, this.format, 'en')
    this.formbuilder()
    this.myForm.reset();
    this.voteWinAVG = 0;
    this.matchData = [];
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
  addBet(bet) {
    bet.events.forEach(element => {
      if (element.type.includes("3")) {
        element.type = element.type.replace("3", "0")
      }
      const a = this.dateEventsBet.events.find(x => x.name === element.name)
      if (a) {
       if ((element.type.length > 0) && Number(a.type) !== Number(element.type))  {
          this.betAllRateResultsMinus(a)
          a.type = element.type
         
          
        this.betAllRateResults(element)
        } else {
          if(a.type === element.type){
            a.type = element.type
          this.betAllRateResultsMinus(a)
          this.betAllRateResults(element)
          this.dateEventsBet.events = this.dateEventsBet.events.filter(d => d.name !== a.name)
        }
        }
      } else {
        if (element.type.length > 0) {
          this.betAllRateResults(element)
          this.dateEventsBet.events.push(element)
        }
      }
    });
    // this.eventss.value.forEach(x => {
    //   if (x.name && ((x.type.length > 0) || bet.type)) {

    //     if (x.type === "3") {
    //       x.type = "0"
    //     }
    //     let b = false;
    //     var a = this.dateEventsBet.events.find(y => y.idEvent === x.idEvent)
    //     a ? a = a : a = false
    //     if (!a) {
    //       this.betAllRateResults(x)
    //       this.dateEventsBet.date = this.formattedDate
    //       this.dateEventsBet.events.push(x)
    //     }
    //     else {
    //       if (a) {
    //         if (a.type !== x.type) {
    //           this.betAllRateResultsMinus(a)
    //           this.betAllRateResults(x)
    //           // this.dateEventsBet.events.push(x)
    //           this.dateEventsBet.events.find(y => y.idEvent === x.idEvent, a.type = x.type)

    //         }
    //       }
    //     }
    //   } 
    //   // usuniecie z bet
    // })
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