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
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { NotificationService } from '../../toastr-notification/toastr-notification.service';
import { map } from 'rxjs/operators';
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
export interface PeriodicElement { }
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-graphics-list',
  templateUrl: './graphics-list.component.html',
  styleUrls: ['./graphics-list.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: MomentDateAdapter, deps:
        [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GraphicsListComponent implements OnInit {
  date = new FormControl(moment());
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  numberOfDays;
  oldYear;
  oldMonth;
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
  tableWork= { items: []}
  userGraphic: any[] = [];
  rowHeder: number;
  constructor(private grapicService: GraphicService, private notification: NotificationService, private workerService: WorkerService, private _fb: FormBuilder) {
  }
  getTotal(items) {
    if (items) {
      let total = 0;
      items.forEach(item => {
        if (item.value === true) {
          total += Number(1);
        }

      });

      return total;
    } 
  }
  getWeek(dayNumber) {
    let day = parseInt(dayNumber)
    if (!isNaN(day)) {
      let today = new Date(this.month + '/' + day + '/' + this.year).getDay()
      return today === 0 || today === 6 ? dayNumber + '*' : dayNumber
    }
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
  captureScreen(m,y) {
    var data = document.getElementById('ExampleTable');
    html2canvas(data).then(canvas => {
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      pdf.autoTable({ html: '#ExampleTable', headStyles: { textColor: [76, 76, 76] }, styles: { halign: 'center', fillColor: [236, 236, 236], lineColor: "black", lineWidth: 0.1, fontSize: 6, overflow: 'visible', cellWidth: 'auto' }, });
      pdf.autoTable({ html: '#ExampleTable1', headStyles: { textColor: [76, 76, 76] }, styles: { halign: 'center', fillColor: [236, 236, 236], lineColor: "black", lineWidth: 0.1, fontSize: 6, overflow: 'visible', cellWidth: 'auto' }, });
      pdf.save('Grafik_'+m+'_'+y+'.pdf'); // Generated PDF   
    });
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
    this.oldYear = new Date(this.date.value._d).getFullYear()
    this.oldMonth =new Date(this.date.value._d).getMonth() + 1
    this.setDateGraphic(new Date(this.date.value._d).getFullYear(), (new Date(this.date.value._d).getMonth() + 1))
    this.onChanges();
    this.workerService.getWorker().subscribe(response => {
      this.userG = response
      this.userG.map(x=>{
       [x]
      })
      this.createListWork(this.userG);
      this.checkGraphicExists()

    });
    this.myForm = this._fb.group({
      date: new FormControl(''),
      items:
        this._fb.array([this._fb.control([])])
    })
    this.chosenYearHandler(moment(new Date()))
    this.dataSource = this.rowGraphic
  }
  createListWork(user){
    user.map(x=>{
      this.tableWork.items.push({col1: "Start"}, {col1: "Koniec"}, {col1:"Czas"})
    })
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
      _id: data._id ? data._id : '',
      date: data.date ? data.date : '',
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
    let setId = this.graphics[0] ? this.graphics[0]._id : null;
    this.rowN._id = setId
    console.log(this.userG, Object.keys(this.userG), "object key")
    let user = Object.keys(this.userG).map(key => ([this.userG[key].fname]));
    this.rowN.items.push(...user)
    this.rowN.date.length === 0 ? this.rowN.date = this.month + '.' + this.year : this.rowN.date;
    this.rowN.items.map(x => {
      if (Array.isArray(x)) {
        x.push(...this.userGraphic)
      }
    })
  }
  onSubmit() {
    if (this.rowN._id) {
      this.grapicService.updateGraphics(this.myForm.value).subscribe(() => {
        this.notification.success("Success. Update Grafik" + this.rowN._id)
      })
    } else {
      this.myForm.value._id =null
      this.grapicService.createGraphic(this.myForm.value).subscribe(() => {
        this.notification.success("Success. Create Grafik")
      })
    }

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
      // this.setDatetoTable()
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
    this.rowHeder = this.userGraphic.length

    this.numberOfDays.unshift("Name")
    this.displayedColumns = this.numberOfDays

  }

  isSelectrd(x) {
    return Boolean(JSON.parse(x))
  }
  dateChange(month,year){
    switch (month) {
      case 1 : {return "Styczeń "+year}
      case 2 : {return "Luty "+year}
      case 3 : {return "Marzec "+year}
      case 4 : {return "Kwiecień "+year}
      case 5 : {return "Maj "+year}
      case 6 : {return "Czerwiec "+year}
      case 7 : {return "Lipiec "+year}
      case 8 : {return "Sierpień "+year}
      case 10 : {return "Pazdziernik "+year}
      case 11 : {return "Listopad "+year}
      case 12 : {return "Grudzień "+year}
      case 9 : {return "Wrzesień "+year}
  }

}
}
