import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WorkerService } from '../../../shared/worker.service';

@Component({
  selector: 'app-personel-list',
  templateUrl: './personel-list.component.html',
  styleUrls: ['./personel-list.component.css']
})
export class PersonelListComponent implements OnInit {
 worker:any = []
  constructor(private route: ActivatedRoute, private workerService: WorkerService) { }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idPersonel")) {
        const id = paramMap.get("idPersonel");
        this.workerService.getPosWorker(id).subscribe(response => {
          this.worker = response
          // this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.restaurant.name);
        })
      }

    })
  }

}