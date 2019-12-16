import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { formatDate } from "@angular/common";
import { AnalysticService } from '../../analystic/analystic-service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @Input() count: number;
  @Output() public getUserData = new EventEmitter<string>();
    @Output() amountChanged: EventEmitter<number> =   new EventEmitter();
  @Input() win: number;
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
  typeForVote;
  typeForPercent;
  amount;
  typPercent;
  calculateWinner=0;
  lose =0;
  colorWin= 'none';
  colorText= 'none';
  constructor(private analysticService: AnalysticService) {      
    
//    
  }
    ngOnInit(){
      this.getUserData.emit('welcome to stackoverflow!');
       if(this.event){
      this.analysticService.getAnalystictEvent(this.event)
   .subscribe(
   data => {
    this.eventTournament = data;
    if(this.eventTournament){
      this.checkEvent(this.eventTournament);
      this.checkEventPercentWin(this.eventTournament)
      if(this.typeForVote === this.typeForPercent){
        if(this.typeForVote===0){
        this.colorWin = '#984626';
        this.colorText = 'white';
        
        if(!Number.isNaN(this.startTimestamp)){
          // console.log(this.startTimestamp)
          const date1 = formatDate(this.startTimestamp*1000,"yyyy-MM-dd", 'en')
          const date = formatDate(this.stringData,"yyyy-MM-dd", 'en')
    
          if(date === date1){
              console.log( date ,'=', date1)
          if(this.eventID.winnerCode === 3 && date === date1){
            console.log('wchodzi')
         console.log(this.eventTournament.event.awayTeam.name, "=", this.eventID.winnerCode , "=", this.typeForVote, "=", this.typeForPercent)
         this.changeAmount();
            
        }
          }
          // console.log(this.startTimestamp)
        
        }
        
        }
        if(this.typeForVote===1){
          this.colorWin = 'green';
          this.colorText = 'white';
          }
          if(this.typeForVote===2){
            this.colorWin = 'blue';
            this.colorText = 'white';
            }
        
      }
    }
   });
 }  
      }
    
    checkEvent(eventTournament){
      // console.log("a")
      if(eventTournament !== undefined){
       this.MaxVote = Math.max.apply(null,[eventTournament.vote.vote1Percentage, eventTournament.vote.voteXPercentage, eventTournament.vote.vote2Percentage]);
       this.typeForVote = ((eventTournament.vote.vote1Percentage*100 )=== (this.MaxVote*100))? (eventTournament.vote.vote1Percentage)  : 
       ((eventTournament.vote.voteXPercentage*100 )=== (this.MaxVote*100))? (eventTournament.vote.voteXPercentage) :
       ((eventTournament.vote.vote2Percentage*100 )=== (this.MaxVote*100))? (eventTournament.vote.vote2Percentage) : 0;
        // console.log(this.typeForVote)
       this.typeForVote> 73? (this.typPercent = this.typeForVote) : ''; //typPercent powyzej 70
       this.typeForVote = ((eventTournament.vote.vote1Percentage*100 )=== (this.typPercent*100))? 1 :
       ((eventTournament.vote.voteXPercentage*100 )=== (this.typPercent*100))? 0 :
       ((eventTournament.vote.vote2Percentage*100 )=== (this.typPercent*100))? 2 : 0;
         return true
      }else {
        return false
      }
    }
    checkWining1(eventTournament){
      if(eventTournament.winningOdds.home !== undefined){
        return true
     }else {
      // eventTournament.winningOdds.home.set(JSON.parse('{actual: 0}'))
       return false
     }
    }
    checkWining2(eventTournament){
      if(eventTournament.winningOdds.away !== undefined){
        return true
     }else {
      // eventTournament.winningOdds.away.push(JSON.parse('{actual: 0}'))
       return false
     }
    }
    checkEventAway(eventTournament) {
      if(eventTournament !== undefined){
        return true
     }else {
       return false
     }
    }
    checkEventHome(eventTournament){
      if(eventTournament !== undefined){
        return true
     }else {
       return false
     }
    }
    checkWin(x){
      
    }
    checkEventPercentWin(eventTournament){
      if(this.checkWining1(eventTournament) || this.checkWining2(eventTournament)){
        const home = (eventTournament.winningOdds.home !==undefined)? eventTournament.winningOdds.home.actual : 0;
        const away = (eventTournament.winningOdds.away !==undefined)? eventTournament.winningOdds.away.actual : 0;
        // console.log(away)
        const numberMax = Math.max.apply(null,[away, home]);
        const numberMin = Math.min.apply(null,[away, home]);
        const different = numberMax-numberMin;
        // const numberMin = Math.min.apply(null,[eventTournament.winningOdds.home.actual, eventTournament.winningOdds.away.actual]);
        // if(numberMax >70 && ((numberMax-numberMin)>30)){
        //   this.typeForPercent = eventTournament.winningOdds.home.actual === numberMax? 1 : 2;
        // }

        if(numberMax){
          if(home !== 0){
          // this.typeForPercent = eventTournament.winningOdds.home.actual === numberMax? numberMax : 2;
            if(eventTournament.winningOdds.home.actual === numberMax){
              if(numberMax >70){
                return this.typeForPercent =1
              }else{
                return this.typeForPercent =0
              }
            } else {
              if(numberMax >70){
                return this.typeForPercent =2
              }else{
                return this.typeForPercent =0
                
              }
            }
         } else {
          if(away !== 0){
            this.typeForPercent = eventTournament.winningOdds.away.actual === numberMax? 2 : 1;
           } else 
           this.typeForPercent =0
         }
        }
        return true
      }else{
        return false
      }
    }
    changeAmount() { //Trigger this call from the child component's template
    this.amount =1;
    this.amountChanged.emit(this.amount);
  }
    somethingChanged(){
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


