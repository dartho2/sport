import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../shared/worker.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-p-worker',
  templateUrl: './p-worker.component.html',
  styleUrls: ['./p-worker.component.css']
})
export class PWorkerComponent implements OnInit {
  worker;
  constructor(private workerService: WorkerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idEmployee")) {
        const id = paramMap.get("idEmployee");
        this.workerService.getPosWorker(id).subscribe((response :any) => {
          this.worker = response.workers
        });
      }
    }
    )
  }

}
