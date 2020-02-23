import { Component, OnInit, Input } from '@angular/core';
import { AnalysticService } from '../analystic-service'
import {formatDate} from '@angular/common';
import { Analystic } from '../analystic.model';
import { map } from 'rxjs/operators';


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
@Component({
  selector: 'app-analystic-list',
  templateUrl: './analystic-list.component.html',
  styleUrls: ['./analystic-list.component.css'],
  providers: []
})
export class AnalysticListComponent implements OnInit {
  @Input()
  eventID;
  chance = 0;
  formattedDate;
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
  ClickCounter=0;
  indexWin=0
  win=0;
  eventTournament;
  MaxVote;
  chanceChanged;
  amountChanged;
  draw;
  typeForVote;
  typeForPercent;
  amount;
  typPercent;
  teamRating;
  calculateWinner = 0;
  lose = 0;
  colorWin = 'none';
  colorText = 'none';
  votePrice;
  VotePrice: number;
  constructor(private analysticService: AnalysticService) { 
    this.myNewDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.stringData= +new Date()
    this.myDate = new Date();
    this.myDate.setDate( this.myDate.getDate());
    this.formattedDate = formatDate(this.myDate, this.format, 'en');
    this.getMatches();
    }
    getMatches(){
      this.matchData = [];
      this.analysticService.getAnalystict(this.formattedDate).pipe(map(res=>{
        res.map(turnaments=>{
          turnaments.events.forEach(events=>{
            let keys = []
            if(this.checkeventsExists(events.formatedStartDate, this.formattedDate) ){
              this.analysticService.getAnalystictEvent(events.id).subscribe(
                eventsData=>{
                  this.eventTournament = eventsData;
          
                  this.analysticService.getVotePrice(events.id).subscribe(
                      vote=>{
                        events["vote"] =  vote.markets[0];
                        events["turnament"] =  turnaments.category;
                        events["events"] =  eventsData;
                        // console.log(vote)
                      
                          keys.push(events)
                          this.matchData.push(...keys)
                      
                      
                      }
                  )
                  
                 
                }
              )
            }
          })
        })
        
      }))
      .subscribe(
      data => {
       this.matchFootball = data; 
       console.log(this.matchData)   
      })
    }

    mapingData(data){
      this.matchData = [];
      data.map(x=> {
        x.events.map(y=>{
          let keys = []
         
         if(this.checkeventsExists(y.formatedStartDate, this.formattedDate) ){
          
      this.analysticService.getAnalystictEvent(y.id)
      .subscribe(
        data => {

          this.eventTournament = data;
          keys.push(y, x, this.eventTournament)
          this.matchData.push(keys)
          // console.log(this.matchData)
          // console.log(this.matchData)
          if (this.eventTournament) {
            this.checkEvent(this.eventTournament);
            this.checkEventPercentWin(this.eventTournament)
            this.checkEventTeamWin(this.eventTournament)
           
            if (this.typeForVote === this.typeForPercent ) {
              if(this.typeForVote === this.teamRating){
              if (this.typeForVote === 0) {
                this.colorWin = '#984626';
                this.colorText = 'white';

                if (!Number.isNaN(keys[0].startTimestamp)) {
                  // console.log(this.startTimestamp)
                  const date1 = formatDate(keys[0].startTimestamp * 1000, "yyyy-MM-dd", 'en')
                  const date = formatDate(this.stringData, "yyyy-MM-dd", 'en')
                  // console.log(this.eventTournament.status.code)
                  if ((date === date1) && this.eventTournament.event.status.code === 100) {
                    if (keys[0].winnerCode === 3 && date === date1) { //ustawienie WIN
                      this.changeAmount();

                    }
                    if (keys[0].winnerCode >= 1 && keys[0].winnerCode <= 3 && date === date1) {
                    
                      this.changeAmountMatch();

                    }
                  }
                  // console.log(this.startTimestamp)

                }

              }
              if (this.typeForVote === 1) {
                this.colorWin = 'green';
                this.colorText = 'white';
              }
              if (this.typeForVote === 2) {
                this.colorWin = 'blue';
                this.colorText = 'white';
              }

            }
          }
        }
    
        
    })
      }
        })
      })
         
    }
    checkEventTeamWin(eventTournament) {
      if (eventTournament !== undefined) {
        // console.log(eventTournament.event.teamsForm)
        if (eventTournament.teamsForm !== undefined && eventTournament.teamsForm !== null && eventTournament.teamsForm !== undefined && eventTournament.teamsForm !== null) {
          if (eventTournament.teamsForm.homeTeam.avgRating !== null && eventTournament.teamsForm.awayTeam.avgRating !== null) {
            if (eventTournament.teamsForm.homeTeam.avgRating > eventTournament.teamsForm.awayTeam.avgRating) {
              const teamDiff = eventTournament.teamsForm.homeTeam.avgRating - eventTournament.teamsForm.awayTeam.avgRating
              if(teamDiff > 0.1){
                this.teamRating = 1
              }
              if(teamDiff < 0.1){
                this.teamRating = 0
              }
              this.teamRating 
            } else {
              const teamDiff = eventTournament.teamsForm.awayTeam.avgRating - eventTournament.teamsForm.homeTeam.avgRating
              if(teamDiff > 0.1){
                this.teamRating = 2
              }
              if(teamDiff < 0.13){
                this.teamRating = 0
              }
            }
  
          }
  
          //  const teamDiff = eventTournament.teamsForm.homeTeam.avgRating -  eventTournament.event.teamsForm.awayTeam.avgRating
        }
      }
    }
    checkEvent(eventTournament) {
      // console.log("a")
      if (eventTournament !== undefined) {
        this.MaxVote = Math.max.apply(null, [eventTournament.vote.vote1Percentage, eventTournament.vote.voteXPercentage, eventTournament.vote.vote2Percentage]);
        this.typeForVote = ((eventTournament.vote.vote1Percentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.vote1Percentage) :
          ((eventTournament.vote.voteXPercentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.voteXPercentage) :
            ((eventTournament.vote.vote2Percentage * 100) === (this.MaxVote * 100)) ? (eventTournament.vote.vote2Percentage) : 0;
        // console.log(this.typeForVote)
        this.typeForVote > 56 ? (this.typPercent = this.typeForVote) : ''; //typPercent powyzej 70
        this.typeForVote = ((eventTournament.vote.vote1Percentage * 100) === (this.typPercent * 100)) ? 1 :
          ((eventTournament.vote.voteXPercentage * 100) === (this.typPercent * 100)) ? 0 :
            ((eventTournament.vote.vote2Percentage * 100) === (this.typPercent * 100)) ? 2 : 0;
        return true
      } else {
        return false
      }
    }
    checkWining1(eventTournament) {
      if (eventTournament.winningOdds.home !== undefined) {
        return true
      } else {
        // eventTournament.winningOdds.home.set(JSON.parse('{actual: 0}'))
        return false
      }
    }
    checkWining2(eventTournament) {
      if (eventTournament.winningOdds.away !== undefined) {
        return true
      } else {
        // eventTournament.winningOdds.away.push(JSON.parse('{actual: 0}'))
        return false
      }
    }
  
   
    checkEventPercentWin(eventTournament) {
      if (this.checkWining1(eventTournament) || this.checkWining2(eventTournament)) {
        const home = (eventTournament.winningOdds.home !== undefined) ? eventTournament.winningOdds.home.actual : 0;
        const away = (eventTournament.winningOdds.away !== undefined) ? eventTournament.winningOdds.away.actual : 0;
        const home1 = (eventTournament.winningOdds.home !== undefined) ? eventTournament.winningOdds.home.decimalValue : 0;
        const away2 = (eventTournament.winningOdds.away !== undefined) ? eventTournament.winningOdds.away.decimalValue : 0;
        if(home1 && away2){
          this.draw = (9.20 - (parseFloat(eventTournament.winningOdds.home.decimalValue) + parseFloat(eventTournament.winningOdds.away.decimalValue))).toFixed(2)
        }
        const numberMax = Math.max.apply(null, [away, home]);
        const numberMin = Math.min.apply(null, [away, home]);
        const different = numberMax - numberMin;
        
  
        if (numberMax) {
          if (home !== 0) {
            if (eventTournament.winningOdds.home.actual === numberMax) {
              if (numberMax > 70) {
                return this.typeForPercent = 1
              } else {
                return this.typeForPercent = 0
              }
            } else {
              if (numberMax > 70) {
                return this.typeForPercent = 2
              } else {
                return this.typeForPercent = 0
  
              }
            }
          } else {
            if (away !== 0) {
              this.typeForPercent = eventTournament.winningOdds.away.actual === numberMax ? 2 : 1;
            } else
              this.typeForPercent = 0
          }
        }
        return true
      } else {
        return false
      }
    }
    changeAmount() { //Trigger this call from the child component's template
      this.amount = 1;
      // this.amountChanged.emit(this.amount);
      this.amountChanged = this.amount
    }
    changeAmountMatch() { //Trigger this call from the child component's template
      const chance = 1
      // this.chanceChanged.emit(chance);
      this.chanceChanged = chance
    }
    calculateValueChance(value){
     return (eval(value)+1).toFixed(2)

    }
    somethingChanged() {
      this.checkEvent(this.eventTournament)
  
    }
    checkeventsExists(dataEvent, data) {
      if(dataEvent.slice(0,-1) === formatDate(data, this.actualformat, 'en')){
        return true
      } else {
        return false
      }
        }
    onSearchChange(data){
      console.log(data)
      data.setDate( data.getDate());
      this.formattedDate = formatDate(data, this.format, 'en');
      this.stringData = this.formattedDate
      
    this.getMatches();
    }
    changePercent(event) {
      this.percentChance =event
    }
    formatLabel(value: number) {
      if (value >= 100) {
        // this.percentChance = Math.round(value / 100);
        return Math.round(value / 100) + '%';
      }
      this.percentChance =value
      return value;
    }
    onAmountChanged(amount: number) { 
      const winer = 1;
      this.indexWin = this.indexWin +(winer *3.4*2)/1.12
      this.win = this.win + amount
    }
    onchanceChanged(amount: number) { 
      this.chance = this.chance + amount
    }
   

  ngOnInit() {
   
   
  }
  
}
