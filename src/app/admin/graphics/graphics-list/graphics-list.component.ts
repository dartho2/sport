import { Component, OnInit, OnChanges } from '@angular/core';
import { GraphicService } from '../graphic.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  }, display: {
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

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
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
  myForm: FormGroup;
  week;
  // rowN = [
  //   ["a"], ["b"], ["c"], ["p"]
  // ]
  rowN = [{
    "date": "",
    'items': []
  }]
  userG = [["p"], ["a"]];
  rowGraphic;
  // datag: any[] = [];
  // dataf: any[] = [];
  // datafort: any;
  month: number;
  year: number;
  // graphic: any[] = [];
  userGraphic: any[] = [];
  constructor(private grapicService: GraphicService, private _fb: FormBuilder) { }
  getColor(dayNumber) {
    let day = parseInt(dayNumber)
    if (!isNaN(day)) {
      let today = new Date(this.month + '/' + day + '/' + this.year).getDay()
      return today === 0 || today === 6 ? '#b7b7b7' : ''
    }

  }
  ngOnInit() {
    this.myForm = this._fb.group({
      items: this._fb.array([])
    })
    this.setDateGraphic(new Date(this.date.value._d).getFullYear(), (new Date(this.date.value._d).getMonth() + 1))
    this.onChanges();
    // this.grapicService.getGraphic()
    this.setDatetoTable();
    this.dataSource = this.rowGraphic
  }
  setDatetoTable() {
    this.rowN.map(x => {
      x.date.length === 0 ? x.date = this.month + '.' + this.year : x.date;
      x['items'].push(...this.userG);
      x['items'].forEach((a: any) => {
        if (Array.isArray(a)) {
          a.push(...this.userGraphic)
        }
      })
      this.rowGraphic = x['items'];
    })
    this.myForm.patchValue(this.rowN)
  }
  onChanges(): void {
    this.date.valueChanges.subscribe(val => {
      let year = new Date(val._d).getFullYear();
      let month = (new Date(val._d).getMonth() + 1)
      this.setDateGraphic(year, month)
    });
  }
  setDateGraphic(year, month) {
    this.year = year
    this.month = month
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
