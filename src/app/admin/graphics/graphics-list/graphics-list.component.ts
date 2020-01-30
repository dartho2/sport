import { Component, OnInit } from '@angular/core';
import { GraphicService } from '../graphic.service';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface PeriodicElement {

}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-graphics-list',
  templateUrl: './graphics-list.component.html',
  styleUrls: ['./graphics-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class GraphicsListComponent implements OnInit {
  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  numberOfDays;
  week;
  // rowN = [
  //   ["a"], ["b"], ["c"], ["p"]
  // ]
  rowN =  [{ "date": "",
   'items': []
  }]
  userG = [["p"],["a"]];
  rowGraphic;
  datag: any[] = [];
  dataf: any[] = [];
  datafort: any;
  month: number;
  year: number;
  graphic: any[] = [];
  userGraphic: any[] = [];
  constructor(private grapicService: GraphicService) { }
  getColor(dayNumber) {
    let day = parseInt(dayNumber)
    if (!isNaN(day)) {
      let today = new Date(this.month + '/' + day + '/' + this.year).getDay()
      return today === 0 || today === 6 ? '#b7b7b7' : ''
    }

  }
  ngOnInit() {
    this.grapicService.getGraphic()
    this.setDateGraphic()
    this.rowN.map(x=>{
    x.date.length === 0 ? x.date = this.month+'.'+this.year: x.date ;
      x['items'].push(...this.userG);
      x['items'].forEach((a: any) =>{
          if(Array.isArray(a)){
          a.push(...this.userGraphic)
        } 
      })
      this.rowGraphic = x['items'];
    })
    console.log(this.rowN)
this.dataSource = this.rowGraphic

  }
  setDateGraphic() {
    this.year = new Date().getFullYear()
    this.month = (new Date().getMonth() + 1)
    let firstOfMonth = new Date(this.year, this.month - 1, 1)
    let lastOfMonth = new Date(this.year, this.month, 0).getDate()
    this.numberOfDays = Array.apply(null, Array(lastOfMonth)).map(function (x, i) { return (i + 1).toString(); })
    this.userGraphic = Array.apply(null, Array(lastOfMonth)).map(function (x, i) { return false })
    this.numberOfDays.unshift("Name")
    this.displayedColumns = this.numberOfDays

  }

  isSelectrd(x) {
    return Boolean(JSON.parse(x))
  }

}
