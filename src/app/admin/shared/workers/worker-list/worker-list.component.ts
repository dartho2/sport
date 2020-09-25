import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../worker.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { NotificationService } from '../../../toastr-notification/toastr-notification.service'; 

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.css']
})
export class WorkerListComponent implements OnInit {
  workers;
  users;
  bodyForm: FormGroup;
  constructor(private workerService: WorkerService, private _fb: FormBuilder,private notification: NotificationService) { }
  
  get user() {
    return <FormArray>this.bodyForm.get('users');
  }
  ngOnInit() {
    this.workerService.getWorker().subscribe(response => {
      this.workers = response
      this.workers.map(x=>{
        this.workers = x;
        this.users = x.users})
      this.buildFormforWorker(this.workers)
    });

    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      users: this._fb.array([])

    })
  }
  deleteUser(index) {
    let control = <FormArray>this.bodyForm.controls.users;
    control.removeAt(index)
  }
  addNewUser() {
    let control = <FormArray>this.bodyForm.controls.users;
    control.push(
      this._fb.group({
        name: '',
      })
    )
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
      _id: user._id,
      users: this._fb.array(
        this.getUsers(user.users)
      )
    })
  }

  onSubmit() {
    console.log(this.bodyForm)
    this.workerService.updateProduct(this.bodyForm.value._id,this.bodyForm.value ).subscribe(x=>{
      console.log("update")
    })
    this.notification.error("Brak zaimplementowanej logiki do obsługi zapisu");
  }

}
