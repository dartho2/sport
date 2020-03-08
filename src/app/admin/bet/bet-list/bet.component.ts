import { Component, OnInit } from '@angular/core';
import { BetServiceComponent } from '../bet-service'
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {
events;
event;
mode = false;
dataEvent;
idEvent;
panelOpenState = false;
  constructor(private betService: BetServiceComponent, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.betService.getBetAll().subscribe(eventData => {
        this.event = eventData
    })
      if (paramMap.has("date") && paramMap.has("id")) {
        
        var dateEvent = paramMap.get("date");
        var idEvent = paramMap.get("id");
        this.betService.getBet(dateEvent).subscribe(eventData => {
          console.log(eventData)
            this.events = eventData
            this.mode = true;
            this.dataEvent = dateEvent
            this.idEvent = idEvent
          
        })
      } else {
        
      }
    })
    // this.betService.getBet()
  }

}
