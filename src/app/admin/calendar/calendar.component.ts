import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  timeFrom;
  daysFormated = -7;
  iiidate;
  prvExists= false;
  todayDay = new Date();
  dataFormated= [];
  hours=  [{h: '12:00', res: false},{h: '12:30', res: false},{h: '13:00', res: false}] 
  dataRes =[
    {day: '28/03/2020', hours: [{h: '12:00', res: false},{h: '12:30', res: false},{h: '13:00', res: true}]},
    {day: '29/03/2020', hours: [{h: '12:00', res: false},{h: '12:30', res: true},{h: '13:00', res: false}]} 
  ]
  pipe = new DatePipe('en-US')
  getData;
  constructor() { }
  formatDays(x, data){
    this.iiidate = [];
    for (let I = 0; I < Math.abs(x); I++) {
      this.iiidate.push({date: new Date(data - ((x >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000))});
    }
    return this.iiidate;
}
checkPrvExists(){
if (this.pipe.transform(this.todayDay, 'dd/MM/yyyy') !== this.pipe.transform(this.iiidate[0].date, 'dd/MM/yyyy')){
  return true
}
return false
}
dataReser(){
  this.prvExists = this.checkPrvExists()
  console.log(this.iiidate)
  this.iiidate.forEach(element => {
    let hoursRes = this.dataRes.find(x=> x.day === this.pipe.transform(element.date, 'dd/MM/yyyy'))
    if(hoursRes){
      let hours = hoursRes.hours
      this.dataFormated.push({date: this.pipe.transform(element.date, 'dd/MM/yyyy'), hours})
    }else{
      this.dataFormated.push({date: this.pipe.transform(element.date, 'dd/MM/yyyy'), hours:this.hours})
    }
   
  });
}
nextWeek(){
  this.dataFormated = []
  this.getData = this.getData+ 7 * 24 * 60 * 60 * 1000
  let data =new Date(this.getData)
  this.formatDays(this.daysFormated, data)
  this.dataReser()
  console.log(this.iiidate[0].date, this.todayDay)
 
}
prevWeek(){
  this.dataFormated = []
  this.getData = this.getData-7 * 24 * 60 * 60 * 1000
  let data =new Date(this.getData)
  this.formatDays(this.daysFormated,data)
  this.dataReser()
 
}
  ngOnInit() {
    this.getData = new Date().getTime()
    this.formatDays(this.daysFormated, this.getData);
    this.dataReser()
    
  
    

  }
 

}
