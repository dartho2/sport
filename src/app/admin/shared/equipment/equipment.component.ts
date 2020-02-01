import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EquipmentService } from '../equipment/equipment.service'
import { NotificationService } from '../../toastr-notification/toastr-notification.service'
@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  bodyForm: FormGroup;
  equipment;
  selectedValue: ['Zamrażalka', 'Lodówka'];
  constructor(private equipmentService: EquipmentService, private _fb: FormBuilder,private notification: NotificationService) { }


  get items() {
    return <FormArray>this.bodyForm.get('items');
  }
  ngOnInit() {
    this.equipmentService.getEquipment().subscribe(response => {
      this.equipment = response
      this.equipment.map(x=>{
        this.equipment = x
      })
      this.buildFormforWorker(this.equipment)
    });

    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      items: this._fb.array([])

    })
  }
  deleteItems(index) {
    let control = <FormArray>this.bodyForm.controls.items;
    control.removeAt(index)
  }
  addNewItems() {
    let control = <FormArray>this.bodyForm.controls.items;
    control.push(
      this._fb.group({
        name: '',
        number: ''
      })
    )
  }

  getUsers(user: any): FormGroup[] {
    return user ? user.map(x => {
      return this._fb.group({
        name: x.name,
        number: x.number
      })
    }):''

  }
  buildFormforWorker(user): FormGroup {
    return this.bodyForm = this._fb.group({
      items: this._fb.array(
        this.getUsers(user.items)
      )
    })
  }

  onSubmit() {
    this.notification.error("Brak zaimplementowanej logiki do obsługi zapisu");
  }
}
