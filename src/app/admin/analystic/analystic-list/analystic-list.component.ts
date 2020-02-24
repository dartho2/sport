import { Component, OnInit, Input } from '@angular/core';
import { AnalysticService } from '../analystic-service'
import {formatDate} from '@angular/common';
import { Analystic } from '../analystic.model';
import { map, reduce } from 'rxjs/operators';


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
  totalWin=0;
  totalMatch=0;
  totalWinTotal=0;
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
  model1;
  mymodel;
  typPercent;
  teamRating;
  voteWinValue= [];
  voteWinSum= 0;
  voteWinAVG=0;
  calculateWinner = 0;
  lose = 0;
  colorWin = 'none';
  colorText = 'none';
  votePrice;
  VotePrice: number;
  winSure = 0;
  winSureAll= 0;
  returnCost: number;
  numberPercent= 70;
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
                  // console.log(this.eventTournament)
                  this.analysticService.getVotePrice(events.id).subscribe(
                      vote=>{
                        events["vote"] =  vote.markets[0];
                        events["turnament"] =  turnaments.category;
                        events["events"] =  eventsData;
                        events["chanceEvent"] = this.calculateChance(events["events"], events["events"].winningOdds)
                        events["chanceEventVote"] = this.calcuateVoteChance(events["events"])
                        events["h2hDuel"] = this.calculateH2hDuel(events["events"].h2hDuel)
                        events["chanceEvent"] === events["chanceEventVote"] && events["chanceEventVote"] === events["h2hDuel"]  ? events["win"] = events["h2hDuel"] : '';
                        if([1,2,3].includes(events.winnerCode)){
                        this.totalMatch += 1;
                        if(events["win"] !== undefined  &&  events.winnerCode !== undefined){
                          this.totalWinTotal += 1
                          
                          if(events["win"] === 1){
                            if(events["winnerCode"] === 1){
                            this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[0].fractionalValue))
                            this.voteWinSum= 0;
                            this.voteWinValue.forEach(x=>{                             
                              this.voteWinSum += parseFloat(x)
                            })
                          }
                          }
                          if(events["win"] === 2){
                            if(events["winnerCode"] === 2){
                               this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[2].fractionalValue))
                            this.voteWinSum= 0;
                            this.voteWinValue.forEach(x=>{
                              this.voteWinSum += parseFloat(x)
                            })
                            }
                           
                           
                          }
                          if(events["win"] === 0){
                            if(events["winnerCode"] === 3){
                            this.voteWinValue.push(this.calculateValueChance(events["vote"].choices[1].fractionalValue))
                            this.voteWinSum= 0;
                            this.voteWinValue.forEach(x=>{
                              this.voteWinSum += parseFloat(x)
                            })
                          }
                          }
                          this.voteWinAVG = (this.voteWinSum / this.voteWinValue.length);
                          
                        }
                        if(events.winnerCode === 3){
                          const winerCodeChange = 0;
                          if([events["chanceEvent"], events["h2hDuel"],  events["chanceEventVote"]].includes(winerCodeChange)){
                            this.totalWin += 1
                          }
                          events["win"] ===  winerCodeChange ? this.indexWin += 1 : '';
                        }
                        if(events.winnerCode === 2){
                          const winerCodeChange = 2
                          if([events["chanceEvent"], events["h2hDuel"],  events["chanceEventVote"]].includes(winerCodeChange)){
                            this.totalWin += 1
                          }
                          events["win"] ===  winerCodeChange ? this.indexWin += 1 : '';
                        }
                        if(events.winnerCode === 1){
                          const winerCodeChange = 1
                          if([events["chanceEvent"], events["h2hDuel"],  events["chanceEventVote"]].includes(winerCodeChange)){
                            this.totalWin += 1
                          }
                          events["win"] ===  winerCodeChange ? this.indexWin += 1 : '';
                        }}else {
                          if(events.status.code)
                          events["win"] = 401;
                        }
                        if(this.totalMatch === 0 ){
                          let winALL = 1;
                        this.winSureAll = Number(((this.totalWin*100)/winALL).toFixed(0))
                        }else{
                          this.winSureAll = Number(((this.totalWin*100)/this.totalMatch).toFixed(0))
                        }
                        if(this.indexWin === 0 ){
                          let win = 1;
                          this.winSure = Number(((win*100)/this.totalWinTotal).toFixed(0))
                        }else{
                          this.winSure = Number(((this.indexWin*100)/this.totalWinTotal).toFixed(0))
                        }
                        if(this.voteWinAVG,this.indexWin ,this.totalWinTotal){
                          this.returnCost = (((2*this.voteWinAVG)*this.indexWin)/1.14)-(this.totalWinTotal)*2 // stawka 2 
                        }
                          
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
    onWinhange(price){
      this.returnCost = (((price*this.voteWinAVG)*this.indexWin)/1.14)-(this.totalWinTotal)*price
    }
    getColor(voteWinAVG){
     if( voteWinAVG > 70) { return 'green'}else{return 'red';}

    }
    calculateH2hDuel(h2hDuel){
    
     const max = Math.max(...[Number(h2hDuel.awaywins), Number(h2hDuel.homewins), Number(h2hDuel.draws)]);

     if(max === h2hDuel.awaywins){
      return 2
     }else{
      if(max === h2hDuel.homewins){
        return 1
      }else{
        return 0
      }
     }
    }
    calcuateVoteChance(eventTournament){
      if(eventTournament !== undefined){
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

 calculateChance(eventTournament, vote){
    if(vote.length !== 0 && (vote.home !== undefined || vote.away !== undefined)){
      const home = (vote.home !== undefined) ? vote.home.actual:  0;
      const away = (vote.away !== undefined) ? vote.away.actual:  0;
              const numberMax = Math.max.apply(null, [away, home]);
              const numberMin = Math.min.apply(null, [away, home]);
              const different = numberMax - numberMin;
                if (home !== 0) {
                  
                  if (home === numberMax) {
                    if (numberMax > 70) {
                      
                      return  1
                    } else {
                      return  0
                    }
                  } else {
                    if (numberMax > 70) {
                      return  2
                    } else {
                      return  0
        
                    }
                  }
                } else {
                  if (away !== 0) {
                    return away === numberMax ? 2 : 1;
                  } else
                    return 0
                }
              
         }else{
      return ""
         }
 }
 calculateWinningOdds(vote){
  
  
  
 }


  
  
   
    checkeventsExists(dataEvent, data) {
      if(dataEvent.slice(0,-1) === formatDate(data, this.actualformat, 'en')){
        return true
      } else {
        return false
      }
        }
        changePercent(x){
          // this.getMatches(x)
        }
        onSubmit(event){
          this.numberPercent = event
          this.voteWinAVG= 0;
          this.voteWinValue=[];
          this.winSureAll = 0;
          this.totalWin=0;
          this.winSure=0;
          this.totalMatch=0;
          this.totalWinTotal=0;
          this.indexWin=0
          this.getMatches()
        }
    onSearchChange(data){
      this.voteWinAVG= 0;
      this.voteWinValue=[];
      this.winSureAll = 0;
      this.totalWin=0;
      this.winSure=0;
      this.totalMatch=0;
      this.totalWinTotal=0;
      this.indexWin=0
      data.setDate( data.getDate());
      this.formattedDate = formatDate(data, this.format, 'en');
      this.stringData = this.formattedDate
      
    this.getMatches();
    }
    calculateValueChance(value){
      return (eval(value)+1).toFixed(2)
 
     }
    onchanceChanged(amount: number) { 
      this.chance = this.chance + amount
    }
   

  ngOnInit() {
   
   
  }
  
}
