import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RestaurantService } from '../shared/restaurants/restaurants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurant;
  gridColumns = 4;

 
  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap)
      if (paramMap.has("idRestaurant")) {
      }
    })
    this.restaurantService.getPosRestaurant().subscribe(response =>{
      this.restaurant = response
    })
  }
 

}
