import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../worker.service';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
  worker;

  constructor(private workerService: WorkerService) { }

  ngOnInit() {
    this.workerService.getWorker().subscribe(response => {
      this.worker = response
    });
  }

}
