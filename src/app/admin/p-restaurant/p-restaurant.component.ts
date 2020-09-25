import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RestaurantService } from '../shared/restaurants/restaurants.service';

@Component({
  selector: 'app-p-restaurant',
  templateUrl: './p-restaurant.component.html',
  styleUrls: ['./p-restaurant.component.css']
})
export class PRestaurantComponent implements OnInit {
  restaurant: any = [];
  storageOpen: Boolean = false;
  employeeOpen: Boolean = false;
  constructor(private route: ActivatedRoute, private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRestaurant")) {
        const id = paramMap.get("idRestaurant");
        this.restaurantService.getPosRestaurantId(id).subscribe(response => {
          this.restaurant = response
        })
      }
      if (paramMap.has("idStorage")) {
        const id = paramMap.get("idStorage");
        this.storageOpen = true;

      }
      if (paramMap.has("idEmployee")) {
        const id = paramMap.get("idEmployee");
        this.employeeOpen = true;
       
      }
    })
  }

}
