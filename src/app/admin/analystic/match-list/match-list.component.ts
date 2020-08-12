import { Component, OnInit, Input } from '@angular/core';
import { AnalysticService } from '../analystic-service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {
  @Input() matchData: any;

  constructor(private analysticService: AnalysticService) { }

  ngOnInit() {
  }
}
