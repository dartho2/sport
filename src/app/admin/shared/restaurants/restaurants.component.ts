import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurants.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AlertService } from 'src/app/_alert/alert.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants;
  bodyForm: FormGroup;
  constructor(private restaurantService: RestaurantService, private _fb: FormBuilder,
    private alertService: AlertService) { }

  get itemsres() {
    return <FormArray>this.bodyForm.get('itemsres');
  }
  ngOnInit() {
    this.restaurantService.getRestaurant().subscribe(response=>{
      this.restaurants = response
      this.restaurants.map(x=>{
        this.restaurants = x
      })
      this.buildFormforWorker(this.restaurants)
    });

    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      itemsres: this._fb.array([])

    })
  }
  deleteItems(index) {
    let control = <FormArray>this.bodyForm.controls.itemsres;
    control.removeAt(index)
  }
  addNewItems() {
    let control = <FormArray>this.bodyForm.controls.itemsres;
    control.push(
      this._fb.group({
        name: '',
        value: ''
      })
    )
  }

  getUsers(user: any): FormGroup[] {
    return user ? user.map(x => {
      return this._fb.group({
        name: x.name,
        value: x.value
      })
    }):''

  }
  buildFormforWorker(user): FormGroup {
    return this.bodyForm = this._fb.group({
      itemsres: this._fb.array(
        this.getUsers(user.itemsres)
      ),
      id: user._id
    })
  }

  onSubmit() {
    if(this.bodyForm.value.id){
      this.restaurantService.updateRestaurantId(this.bodyForm.value, this.bodyForm.value.id ).subscribe(res=>{
        this.alertService.success("Success","Create")
        console.log("add")
      })
    }else{
      this.restaurantService.createRestaurant(this.bodyForm.value, this.bodyForm.value.id ).subscribe(res=>{
        this.alertService.success("Success","Create")
        console.log("add")
      })
    }
   
    this.alertService.error("Info", "Brak zaimplementowanej logiki do obsługi zapisu");
  }
}
