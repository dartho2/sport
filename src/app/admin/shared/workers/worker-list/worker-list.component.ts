import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../worker.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
  worker = {
    users: [{ name: "Pawel" }, { name: "xxx" }, { name: "vvv" }]
  }
  workers;
  bodyForm: FormGroup;
  constructor(private workerService: WorkerService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.workerService.getWorker().subscribe(response => {
      this.workers = response
      // this.buildFormforWorker(this.worker)
    });

    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      users: this._fb.array([])

    })
    // this.buildFormforWorker(this.worker)
  }
  getUsers(user: any): FormGroup[] {
    return user ? user.map(x => {
      return this._fb.group({
        name: x.name
      })
    }):''

  }
  buildFormforWorker(user): FormGroup {
    return this.bodyForm = this._fb.group({
      users: this._fb.array(
        this.getUsers(user.users)
      )
    })
  }

  onSubmit() {

  }

}
