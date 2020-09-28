import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { NgDynamicBreadcrumbService } from 'ng-dynamic-breadcrumb';
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
  graphicsOpen: Boolean = false;
  constructor(private route: ActivatedRoute, private restaurantService: RestaurantService,private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRestaurant")) {
        const id = paramMap.get("idRestaurant");
        this.restaurantService.getPosRestaurantId(id).subscribe(response => {
          this.restaurant = response
          console.log(this.route.snapshot)
          this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.restaurant.name);
          if (paramMap.has("idPersonel")) {
            const id = paramMap.get("idPersonel");
            this.employeeOpen = true;

          }
        })
      }

    })
  }

}
