import { Component, Input, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { AnalysticService } from '../analystic-service'
// import { a, e } from '@angular/core/src/render3';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as _ from 'lodash';
import { HeaderService } from 'src/app/layout/sport/layout/layout.service';
import { formatDate } from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
export interface MatchData {

}

//  TREE END
@Component({
  selector: 'app-analystic-list',
  templateUrl: './analystic-list.component.html',
  styleUrls: ['./analystic-list.component.css'],
  providers: []
})
export class AnalysticListComponent implements OnInit {
  @Input()
  eventID;
  eventsTurnamet: any = [];
  actualformat = "dd.MM.yyyy"
  myForm: FormGroup;
  dataSource = new MatTableDataSource<MatchData>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  uniqueLigue = [1, 4, 8, 13, 17, 19, 36, 39, 42, 47, 33, 39, 52, 53, 62, 38, 679, 202, 7918, 1465, 33563];
  dateEventsBet = { date: '', status: 70, rate: "0", statusEvent: 2, statusChanged: 2, events: [] };
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private analysticService: AnalysticService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private _fb: FormBuilder
  ) { 
    this.formbuilder();
  }

  formbuilder() {
    this.myForm = this._fb.group({
      date: new FormControl(''),
      events: this._fb.array([])
    })
  }
    get eventss() { return this.myForm.get('events') as FormArray }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("data")) {
        const dataEvent = paramMap.get("data");
        this.getMatched(dataEvent)
      }
    })
  }
  getMatched(data) {
    this.dataSource.data = []
    this.formbuilder()
    this.analysticService.getAnalystict(data).subscribe(events => {
      this.eventsTurnamet = events
      this.eventsTurnamet.events.map(eventMatch => {
        if (formatDate(eventMatch.startTimestamp * 1000, this.actualformat, 'en') === formatDate(data, this.actualformat, 'en')) {
          //  CHECK DATA TODAY
          if (eventMatch.tournament.uniqueTournament !== undefined) {
            if (this.uniqueLigue.includes(eventMatch.tournament.uniqueTournament.id)) {
              // CHECK LIGUE
              if (eventMatch.status.code === 0) {
                eventMatch.status = "nie"
                this.analysticService.getAnalystictEvent(eventMatch.id).subscribe(
                  eventsData => {
                    this.analysticService.getVotePrice(eventMatch.id).subscribe(markets => {
                      eventMatch["eventsData"] = eventsData.event
                      eventMatch["marketsData"] = markets.markets
                      eventMatch["choicesFL"] = markets.markets[0].choices
                      eventMatch["choicesDP"] = markets.markets[1].choices
                      eventMatch["formatDate"] = formatDate(data, this.actualformat, 'en')
                      this.dataSource.data.push(eventMatch)
                      this.setCities(eventMatch)
                    })
                  })
              } else {
                eventMatch.status = "tak"
                // this.dataSource.data.push(eventMatch)
                console.log("zakonczony")
              }

            }
          }
        }
      })
    })
  }
  calculateBet(value) {
    let result = eval(value)
    return (parseFloat(result) + 1).toFixed(2)
  }
  clickRadio(event: Event, value: any, eventTurn) {
    const checkEventExistBet = this.dateEventsBet.events.find(x => x.idEvent === eventTurn.id)
    if (checkEventExistBet) {
      checkEventExistBet.type = value
      checkEventExistBet.votePrice = this.betRate(value, eventTurn)
      this.headerService.changeHeaderTitle(this.dateEventsBet, 1)
    } else {
      this.dateEventsBet.events.push({
        type: value,
        away: eventTurn.awayTeam.name,
        home: eventTurn.homeTeam.name,
        name: (eventTurn.homeTeam.name + " " + eventTurn.awayTeam.name),
        idEvent: eventTurn.id,
        dateControl: eventTurn.formatDate,
        vot1: this.calculateBet(eventTurn.choicesFL[0].fractionalValue),
        votX: this.calculateBet(eventTurn.choicesFL[1].fractionalValue),
        vot2: this.calculateBet(eventTurn.choicesFL[2].fractionalValue),
        vot1_d: this.calculateBet(eventTurn.choicesDP[0].fractionalValue),
        vot2_d: this.calculateBet(eventTurn.choicesDP[1].fractionalValue),
        votX_d: this.calculateBet(eventTurn.choicesDP[2].fractionalValue),
        votePrice: this.betRate(value, eventTurn),
      })
      this.headerService.changeHeaderTitle(this.dateEventsBet, 1)
    }
  }

  betRate(type, eventTurn) {
    switch (type) {
      case '1': return this.calculateBet(eventTurn.choicesFL[0].fractionalValue)
      case '2': return this.calculateBet(eventTurn.choicesFL[2].fractionalValue)
      case 'X': return this.calculateBet(eventTurn.choicesFL[1].fractionalValue)
      case '1X': return this.calculateBet(eventTurn.choicesDP[0].fractionalValue)
      case 'X2': return this.calculateBet(eventTurn.choicesDP[1].fractionalValue)
      case '12': return this.calculateBet(eventTurn.choicesDP[2].fractionalValue)
    }
  }
  setCities(events) {
    var existsOnBet = this.dateEventsBet.events.find(x=>x.idEvent === events.id)
   if(existsOnBet){  
    events.type = existsOnBet.type
    let control = <FormArray>this.myForm.controls.events;
    control.push(this._fb.group({
      name: [events.name ? events.name : ''],
      type: existsOnBet.type,
      data: events? events : '',
      typeYT: '',
      typeBT: '',
      typeVI: '',
      time: events.startTime,
      home: events.homeTeam.name,
      away: events.awayTeam.name,
      date: events.formatedStartDate ? events.formatedStartDate : '',
      dateControl: "",
      league: events.tournament.name,
      idEvent: events.id,
      win: "",
      vot1: events.choicesFL[0].fractionalValue,
      votX: events.choicesFL[1].fractionalValue,
      vot2: events.choicesFL[2].fractionalValue,
      vot1_d: events.choicesDP[0].fractionalValue,
      votX_d: events.choicesDP[1].fractionalValue,
      vot2_d: events.choicesDP[2].fractionalValue
    }))
   } else{
    let control = <FormArray>this.myForm.controls.events;
    control.push(this._fb.group({
      name: [events.name ? events.name : ''],
      type: [''],
      data: '',
      typeYT: '',
      typeBT: '',
      typeVI: '',
      time: events.startTime,
      home: events.homeTeam.name,
      away: events.awayTeam.name,
      date: events.formatedStartDate ? events.formatedStartDate : '',
      dateControl: "",
      league: events.tournament.name,
      idEvent: events.id,
      win: "",
      vot1: events.choicesFL[0].fractionalValue,
      votX: events.choicesFL[1].fractionalValue,
      vot2: events.choicesFL[2].fractionalValue,
      vot1_d: events.choicesDP[0].fractionalValue,
      votX_d: events.choicesDP[1].fractionalValue,
      vot2_d: events.choicesDP[2].fractionalValue
    }))
   }
  }
  //   away: "AC Ajaccio"
  // data: ""
  // date: "29.08.2020."
  // dateControl: "2020-08-29"
  // home: "Caen"
  // idEvent: 8738928
  // league: "Ligue 2"
  // name: "Caen - AC Ajaccio"
  // time: "13:00"
  // type: "0"
  // typeBT: ""
  // typeVI: ""
  // typeYT: ""
  // vot1: "2.45"
  // vot1_d: "1.36"
  // vot2: "3.10"
  // vot2_d: "1.40"
  // votX: "2.90"
  // votX_d: "1.53"
  // votePrice: "2.90"
  // win: 0
}