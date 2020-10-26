import { Component, Input, OnInit, Renderer2, ViewChild, ɵConsole } from '@angular/core';
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
  MatchesEvent = [];
  grupCategory = [];
  dataSource = new MatTableDataSource<MatchData>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  uniqueLigue = [1, 4, 8, 13, 19, 36, 39, 42, 47, 33, 39, 52, 53, 62, 38, 679, 202, 7918, 1465, 33563]
  dateEventsBet = { date: '', status: 70, rate: "0", statusEvent: 2, statusChanged: 2, events: [] };
  dataEvent: string;
  eventsTurnamett: any;
  currentCheckedValue = null;
  matchData: any;
  favoriteSeason: string;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private analysticService: AnalysticService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private ren: Renderer2
  ) {
    this.headerService.changeLique(this.uniqueLigue)
    this.formbuilder();
  }

  formbuilder() {
    this.myForm = this._fb.group({
      date: new FormControl(''),
      events: this._fb.array([])
    })
  }
  get events() { return this.myForm.get('events') as FormArray }
  ngAfterViewInit() {
    this.headerService.lique.subscribe((event: any) => {
      this.uniqueLigue = event
      this.dataSource.data = [];
      this.formbuilder();
      this.getMatched(this.dataEvent)
      // this.getMatched(this.dataEvent)
    })
    this.headerService.subject.subscribe((event: any) => {
      if (event.last !== undefined) {
        console.log(event)
        var lastDeleted = this.events.value.findIndex(c => c.idEvent === event.last.idEvent)
        event.last = undefined
        this.events.at(lastDeleted).patchValue({ type: "" });
      }
    })
  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
   
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("data")) { 
        if(!this.dataEvent){
         this.dataEvent = paramMap.get("data");
        this.getMatched(this.dataEvent) 
        } else {
          this.dataEvent = paramMap.get("data");
          this.formbuilder();
          this.getMatched(this.dataEvent)
        }
        
      }
    })
  }
  checkState(el) {
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
  getMatched(data) {
    // this.matchData= [];
    this.dataSource.data = []
    var filterTur: any = [];
    this.grupCategory = []
    this.analysticService.getAnalystict(data).subscribe(events => {
          // ST filtrowanie
      //  ST Grupowanie meczy
      this.eventsTurnamet = events
      this.eventsTurnamet.events = this.eventsTurnamet.events.filter(x => formatDate(new Date(x.startTimestamp * 1000), 'yyyy-MM-dd', 'en') === data )
      var groups:any = []
    groups = [...new Set(this.eventsTurnamet.events.map((item: any) => item.tournament.category.name))]
   groups.forEach(g =>{
    //  var matchAll = this.eventsTurnamet.events.filter((i: any) => i.tournament.category.name === g).length
     
    filterTur = this.eventsTurnamet.events.filter((i: any) => i.tournament.category.name === g)
    var subgrup = [...new Set(filterTur.map((item: any) => 
     {return{ "name": item.tournament.name, "flag":item.tournament.category.flag, "id":item.tournament.id, "countEvent": this.eventsTurnamet.events.filter((i: any) => i.tournament.name === item.tournament.name).length}}
    ))]
  this.grupCategory.push({
          name: g,
          values:  uniqueIdLigue(subgrup, it => it.id)
         })
   })

  
      
   this.headerService.changeGroup(this.grupCategory)

   
      // END filtrowanie
      //  END Grupowanie meczy
      
      this.eventsTurnamet.events.map(eventMatch => {
        if (formatDate(eventMatch.startTimestamp * 1000, this.actualformat, 'en') === formatDate(data, this.actualformat, 'en')) {
          //  CHECK DATA TODAY
    
            // console.log(this.uniqueLigue, "new uniq", eventMatch.tournament.uniqueTournament.id)
            if (this.uniqueLigue.indexOf(eventMatch.tournament.id) !== -1) {
              // CHECK LIGUE
              // console.log(eventMatch.tournament.uniqueTournament.id, eventMatch.awayTeam.name, "X" )
              if (eventMatch.status.code === 0) {
                eventMatch.status = "nie"
                this.analysticService.getAnalystictEvent(eventMatch.id).subscribe(
                  eventsData => {
                    this.analysticService.getVotePrice(eventMatch.id).subscribe(markets => {
                      eventMatch["eventsData"] = eventsData.event
                      eventMatch["marketsData"] = markets.markets
                      if(markets.markets[0]){
                        eventMatch["choicesFL"] = markets.markets[0].choices
                      }
                     
                      if(markets.markets[1]){
                          eventMatch["choicesDP"] = markets.markets[1].choices
                      }
                    
                      eventMatch["formatDate"] = formatDate(data, this.actualformat, 'en')
                      console.log(eventMatch)
                      this.dataSource.data.push(eventMatch)
                      this.setCities(eventMatch)
                      // console.log(this.dataSource.data, this.myForm, "data =")
                    })
                  })
              } else {
                eventMatch.status = "tak"
                // this.dataSource.data.push(eventMatch)
              }

            }
          
        }
      })
    })
  }
  onSubmitForm(f) { }

  calculateBet(value) {
    let result = eval(value)
    return (parseFloat(result) + 1).toFixed(2)
  }
  clickRadio(event, value: any, eventTurn) {
    let toggle = event.source;
    if (toggle) {
      let group = toggle.buttonToggleGroup;
      if (event.value.some(item => item == toggle.value)) {
        group.value = [toggle.value];
        const checkEventExistBet = this.dateEventsBet.events.find(x => x.idEvent === eventTurn.value.idEvent)
        if (checkEventExistBet) {
          checkEventExistBet.type = group.value[0]
          checkEventExistBet.votePrice = this.betRate(group.value[0], eventTurn)
          this.headerService.changeHeaderTitle(this.dateEventsBet, 1)
        } else {
          this.dateEventsBet.events.push({
            type: group.value[0],
            away: eventTurn.value.away,
            home: eventTurn.value.home,
            name: (eventTurn.value.home + " " + eventTurn.value.away),
            idEvent: eventTurn.value.idEvent,
            homeTeamId: eventTurn.value.homeTeamId,
            awayTeamId: eventTurn.value.awayTeamId,
            dateControl: eventTurn.value.formatDate,
            vot1: this.calculateBet(eventTurn.value.vot1),
            votX: this.calculateBet(eventTurn.value.votX),
            vot2: this.calculateBet(eventTurn.value.vot2),
            vot1_d: this.calculateBet(eventTurn.value.vot1_d),
            vot2_d: this.calculateBet(eventTurn.value.vot2_d),
            votX_d: this.calculateBet(eventTurn.value.votX_d),
            votePrice: this.betRate(group.value[0], eventTurn),
          })
          this.headerService.changeHeaderTitle(this.dateEventsBet, 1)
        }  



      }
    }else{
      this.dateEventsBet.events= this.dateEventsBet.events.filter(x => x.idEvent !== eventTurn.value.idEvent)
     
        this.headerService.changeHeaderTitle(this.dateEventsBet, 1)
      
    }
  }

  betRate(type, eventTurn) {
    switch (type) {
      case '1': return this.calculateBet(eventTurn.value.vot1)
      case '2': return this.calculateBet(eventTurn.value.vot2)
      case 'X': return this.calculateBet(eventTurn.value.votX)
      case '1X': return this.calculateBet(eventTurn.value.vot1_d)
      case 'X2': return this.calculateBet(eventTurn.value.vot2_d)
      case '12': return this.calculateBet(eventTurn.value.votX_d)
    }
  }
  setCities(events) {
    var existsOnBet = this.dateEventsBet.events.find(x => x.idEvent === events.id)
    if (existsOnBet) {
      events.type = existsOnBet.type
      let control = <FormArray>this.myForm.controls.events;
      control.push(this._fb.group({
        name: [events.name ? events.name : ''],
        type: existsOnBet.type,
        data: events ? events : '',
        typeYT: '',
        typeBT: '',
        typeVI: '',
        tournament: events.tournament.name,
        category: events.tournament.category.name,
        time: events.startTime,
        startTimestamp: events.startTimestamp*1000,
        homeTeamId: events.homeTeam.id,
        awayTeamId: events.awayTeam.id,
        home: events.homeTeam.name,
        away: events.awayTeam.name,
        date: events.formatedStartDate ? events.formatedStartDate : '',
        dateControl: "",
        league: events.tournament.name,
        idEvent: events.id,
        win: "",
        choicesFL: [events.choicesFL],
        choicesDP: [events.choicesDP],
        vot1: events.choicesFL[0].fractionalValue,
        votX: events.choicesFL[1].fractionalValue,
        vot2: events.choicesFL[2].fractionalValue,
        vot1_d: events.choicesDP[0].fractionalValue,
        votX_d: events.choicesDP[1].fractionalValue,
        vot2_d: events.choicesDP[2].fractionalValue
      }))
    } else {
      let control = <FormArray>this.myForm.controls.events;
      control.push(this._fb.group({
        name: [events.name ? events.name : ''],
        type: '',
        data: '',
        typeYT: '',
        typeBT: '',
        typeVI: '',
        tournament: events.tournament.name,
        category: events.tournament.category.name,
        startTimestamp: events.startTimestamp*1000,
        time: events.startTime,
        home: events.homeTeam.name,
        away: events.awayTeam.name,
        homeTeamId: events.homeTeam.id,
        awayTeamId: events.awayTeam.id,
        date: events.formatedStartDate ? events.formatedStartDate : '',
        dateControl: "",
        league: events.tournament.name,
        idEvent: events.id,
        win: "",
        choicesFL:  [events.choicesFL],
        choicesDP: [events.choicesDP],
        vot1: events.choicesFL[0]? events.choicesFL[0].fractionalValue: 0,
        votX: events.choicesFL[1]? events.choicesFL[1].fractionalValue: 0,
        vot2: events.choicesFL[2]? events.choicesFL[2].fractionalValue: 0,
        vot1_d: events.choicesDP[0]? events.choicesDP[0].fractionalValue: 0,
        votX_d: events.choicesDP[1]? events.choicesDP[1].fractionalValue: 0,
        vot2_d: events.choicesDP[2]? events.choicesDP[2].fractionalValue: 0
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
function uniqueIdLigue(data,key){
  return [
    ...new Map(
      data.map(x=> [key(x),x ])
    ).values()
  ]
}