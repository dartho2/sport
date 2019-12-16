import { Component, OnInit, Input } from '@angular/core';
import { AnalysticService } from '../analystic-service'
import {formatDate} from '@angular/common';
import { Analystic } from '../analystic.model';


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
  formattedDate;
  myDate
  format = 'yyyy-MM-dd';
  myNewDate;
  matchFootball;
  sportItem;
  stringData;
  percentChance = 70;
  ClickCounter=0
  win=0;
  constructor(private analysticService: AnalysticService) { 
    this.myNewDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.stringData= +new Date()
    this.myDate = new Date();
    this.myDate.setDate( this.myDate.getDate());
    this.formattedDate = formatDate(this.myDate, this.format, 'en');
    
    analysticService.getAnalystict(this.formattedDate)
    .subscribe(
    data => {
     this.matchFootball = data;
    });
    }
    public getData(value): void {
      console.log(value) // welcome to stackoverflow!
  }
    onSearchChange(data){
      data.setDate( data.getDate());
      this.formattedDate = formatDate(data, this.format, 'en');
      this.stringData = this.formattedDate
     this.analysticService.getAnalystict(this.formattedDate)
      .subscribe(
      data => {
       this.matchFootball = data;
      });
    }
    changePercent(event) {
      this.percentChance =event
    }
    formatLabel(value: number) {
      if (value >= 100) {
        // this.percentChance = Math.round(value / 100);
        return Math.round(value / 100) + '%';
      }console.log(value)
      this.percentChance =value
      return value;
    }
    onAmountChanged(amount: number) { 
      this.win = this.win + amount
    }

  ngOnInit() {}

}
