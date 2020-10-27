import { Component, OnInit, Input } from '@angular/core';
import { AnalysticService } from '../analystic-service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {
  @Input() awayTeam: any;
  @Input() homeTeam: any;
  @Input() ligue: any;
  win=0
  lose=0
  draw=0
  awayTeamEvents;
  homeTeamEvents;
  constructor(private analysticService: AnalysticService) { }

  ngOnInit() {


  }
}
