import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../shared/restaurants/restaurants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurant;
  gridColumns = 4;

 
  constructor(private restaurantService: RestaurantService) {
   
   }

  ngOnInit() {
    this.restaurantService.getPosRestaurant().subscribe(response =>{
      this.restaurant = response
    })
  }

}
