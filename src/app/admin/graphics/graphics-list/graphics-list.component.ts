import { Component, OnInit, OnChanges } from '@angular/core';
import { GraphicService } from '../graphic.service';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { WorkerService } from '../../shared/worker.service'
import * as _moment from 'moment';
import { exportData } from "../../products/export/exportData";
import { default as _rollupMoment, Moment } from 'moment';
import { NotificationService } from '../../toastr-notification/toastr-notification.service';
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
export interface PeriodicElement {}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-graphics-list',
  templateUrl: './graphics-list.component.html',
  styleUrls: ['./graphics-list.component.css'],
  providers: [
    {provide: DateAdapter,useClass: MomentDateAdapter,deps: 
      [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GraphicsListComponent implements OnInit {
  date = new FormControl(moment());
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  numberOfDays;
  myForm: FormGroup;
  week;
  graphics;
  rowN = {
    "_id": "",
    "date": "",
    "items": []
  }
  userG;
  rowGraphic;
  month: number;
  year: number;
  userGraphic: any[] = [];
  constructor(private grapicService: GraphicService, private notification: NotificationService, private workerService: WorkerService, private _fb: FormBuilder) {
  }

  getColor(dayNumber) {
    let day = parseInt(dayNumber)
    if (!isNaN(day)) {
      let today = new Date(this.month + '/' + day + '/' + this.year).getDay()
      return today === 0 || today === 6 ? '#b7b7b7' : ''
    }
  }
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
  get items() {
    return <FormArray>this.myForm.get('items');
  }
  ngOnInit() {
    this.setDateGraphic(new Date(this.date.value._d).getFullYear(), (new Date(this.date.value._d).getMonth() + 1))
    this.onChanges();
    this.workerService.getWorker().subscribe(response => {
      this.userG = response
      this.checkGraphicExists()
      
    });
    this.myForm = this._fb.group({
      date: new FormControl(''),
      items:
        this._fb.array([this._fb.control([])])
    })
    this.dataSource = this.rowGraphic
  }
  checkGraphicExists() {
    this.grapicService.getGraphic().subscribe(data => {
      this.graphics = data
      this.graphics = this.graphics.filter(x => x['date'] === this.month + '.' + this.year)
      this.graphics[0] ? this.buildFormGraphic(this.graphics[0]) : this.buildFormGraphic(this.rowN);
      this.setDatetoTable();
    })
  }
  buildFormGraphic(data: any): FormGroup {
    return this.myForm = this._fb.group({
      _id: data._id? data._id : '',
      date: data.date? data.date : '',
      items:
        this._fb.array(
          data.items.map(result => {
            return this._fb.array(
              result.map(arrayResult => {
                return arrayResult
              })

            )
          }
          )
        )

    })
  }


  setDatetoTable() {
    this.rowN = {
      "_id": "",
      "date": "",
      "items": []
    }
    let setId = this.graphics[0]? this.graphics[0]._id : null;
    this.rowN._id = setId
    let user = Object.keys(this.userG).map(key => ([this.userG[key].name]));
    this.rowN.items.push(...user)
    this.rowN.date.length === 0 ? this.rowN.date = this.month + '.' + this.year : this.rowN.date;
    this.rowN.items.map(x => {
      if (Array.isArray(x)) {
        x.push(...this.userGraphic)
      }
    })
  }
  onSubmit() {
    if(this.rowN._id){
      this.grapicService.updateGraphics(this.myForm.value).subscribe(() => {
        this.notification.success("Success. Update Grafik"+this.rowN._id)
        })
    }else{
     // this.grapicService.createGraphic(this.myForm.value).subscribe(() => {
    //   this.notification.success("Success. Create Grafik")
    // })
    }
    
  }
  datas(s){
    return"sd"
  }
  exportTable() {
    exportData.exportToExcel("ExampleTable");
  }
  onChanges(): void {
    this.date.valueChanges.subscribe(val => {
      let year = new Date(val._d).getFullYear();
      let month = (new Date(val._d).getMonth() + 1)
      this.checkGraphicExists()
      this.setDateGraphic(year, month)
      this.setDatetoTable()
      this.myForm.patchValue({ date: month + '.' + year })
      
    });
  }
  setDateGraphic(year, month) {
    this.year = year
    this.month = month
    // let firstOfMonth = new Date(this.year, this.month - 1, 1)
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
