import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { formatDate } from "@angular/common";
import { AnalysticService } from '../../analystic/analystic-service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit  {
  @Input() count: number;
  @Output() chanceChanged: EventEmitter<number> = new EventEmitter();
  @Output() amountChanged: EventEmitter<number> = new EventEmitter();
  @Input() win: number;
  // @Input()
  // winerChoise;
  @Input()
  eventID;
  @Input()
  event;
  @Input()
  startTimestamp;
  @Input()
  stringData;
  @Input()
  set percentChance(percentChance: any) {
    this._percentChance = percentChance
    // console.log(percentChance)
    // if(percentChance !== undefined)
    // this.percentChance = percentChance
    // this.checkEvent(this.eventTournament)
  }
  get percentChance(): any {
    this.checkEvent(this.eventTournament)
    return this._percentChance;
  }
  _percentChance;
  eventTournament;
  MaxVote;
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
  constructor(private analysticService: AnalysticService) {

    //    
  }
  ngOnInit() {
    console.log('e',this.event)
    // if (this.event) {
    //   this.analysticService.getAnalystictEvent(this.event)
    //     .subscribe(
    //       data => {
    //         this.eventTournament = data;
    //         if (this.eventTournament) {
    //           this.checkEvent(this.eventTournament);
    //           this.checkEventPercentWin(this.eventTournament)
    //           this.checkEventTeamWin(this.eventTournament)
             
    //           if (this.typeForVote === this.typeForPercent ) {
    //             if(this.typeForVote === this.teamRating){
    //             if (this.typeForVote === 0) {
    //               this.colorWin = '#984626';
    //               this.colorText = 'white';

    //               if (!Number.isNaN(this.startTimestamp)) {
    //                 // console.log(this.startTimestamp)
    //                 const date1 = formatDate(this.startTimestamp * 1000, "yyyy-MM-dd", 'en')
    //                 const date = formatDate(this.stringData, "yyyy-MM-dd", 'en')
    //                 // console.log(this.eventTournament.status.code)
    //                 if ((date === date1) && this.eventTournament.event.status.code === 100) {
    //                   if (this.eventID.winnerCode === 3 && date === date1) { //ustawienie WIN
    //                     this.changeAmount();

    //                   }
    //                   if (this.eventID.winnerCode >= 1 && this.eventID.winnerCode <= 3 && date === date1) {
                      
    //                     this.changeAmountMatch();

    //                   }
    //                 }
    //                 // console.log(this.startTimestamp)

    //               }

    //             }
    //             if (this.typeForVote === 1) {
    //               this.colorWin = 'green';
    //               this.colorText = 'white';
    //             }
    //             if (this.typeForVote === 2) {
    //               this.colorWin = 'blue';
    //               this.colorText = 'white';
    //             }

    //           }
    //         }
    //       }
    //       });
    // }
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
    this.amountChanged.emit(this.amount);
  }
  changeAmountMatch() { //Trigger this call from the child component's template
    const chance = 1
    this.chanceChanged.emit(chance);
  }
  somethingChanged() {
    this.checkEvent(this.eventTournament)

  }

  // checkEventC(typeForVote, typeForPercent){
  //   this.winnerCode = (this.winnerCode === 0)? 'nie Grali': (this.winnerCode === 1)? 1 : (this.winnerCode === 2)? 0 : (this.winnerCode === 3)? 2 : 'Brak';
  //   if(Number(typeForVote) === Number(typeForPercent)){
  //     (Number(this.winnerCode) === Number(typeForVote))? this.win = this.win +Number(this.winnerCode) : this.lose = this.lose + Number(this.winnerCode)
  //     return true
  //   } else {
  //     return false
  //   };
  // }

}


