import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {

}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-graphics-list',
  templateUrl: './graphics-list.component.html',
  styleUrls: ['./graphics-list.component.css']
})
export class GraphicsListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  numberOfDays;
  week;
  rowN =[
    "a","b","c","p"
  ]
  datag: any[] = [];
  dataf: any[] = [];
  datafort: any;
  constructor() { }

  ngOnInit() {
   
    console.log(this.dataSource)
    var y = new Date().getFullYear()
    var m = (new Date().getMonth()+1)
    console.log('y/m', y , m)
  var firstOfMonth = new Date(y, m-1,1)
  console.log('first', firstOfMonth.getDay())
  if (firstOfMonth.getDay()< 6)
  {
  this.week = 6-firstOfMonth.getDay()
  console.log('week', this.week)
  }
    var lastOfMonth = new Date(y,m, 0).getDate()
    this.numberOfDays = Array(lastOfMonth)
  //  this.numberOfDays.map(function (x, i) { return 'a' })
  this.numberOfDays = Array.apply(null, Array(lastOfMonth)).map(function (x, i) { return (i+1).toString(); })
  // this.numberOfDays.push("pawel").at(0)
  console.log('aarray', this.numberOfDays)
  var dd = this.numberOfDays
  this.numberOfDays.unshift("Name")
  console.log(' this.numberOfDays',  this.numberOfDays)
  //  this.tableHeder(this.numberOfDays)
  // this.datag = this.numberOfDays
  this.datafort = Array.apply(null, Array(lastOfMonth)).map(function (x, i) { return false })
  this.datafort.unshift("Pawel")
  this.datag.push([this.datafort])
 this.datag.push([this.datafort])
  console.log('dataf', this.datag)
 this.dataSource = this.datag
   this.displayedColumns = this.numberOfDays
    // var used = firstOfMonth.getDay() +6 + lastOfMonth.getDay();
    // this.numberOfDays = Math.ceil(used / 7) 
    console.log('this.dataSource', this.dataSource)
    console.log('displayedColumns',this.displayedColumns)
  }
  // tableHeder(length){
  //   for(var i = 0; i < length; i++) {
  //     data.push(createSomeObject());
  // }
  
  isSelectrd(x){
    return Boolean(JSON.parse(x))
  }
  
}
