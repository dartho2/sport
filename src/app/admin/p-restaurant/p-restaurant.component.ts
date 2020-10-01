import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs';
import { NgDynamicBreadcrumbService } from 'ng-dynamic-breadcrumb';
import { AlertService } from 'src/app/_alert/alert.service';
import { RestaurantService } from '../shared/restaurants/restaurants.service';
import { NotificationComponent } from '../toastr-notification/toastr-notification.component';
import { NotificationService } from '../toastr-notification/toastr-notification.service';

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
  constructor(protected alertService: AlertService, private route: ActivatedRoute, private notification: NotificationService,private restaurantService: RestaurantService,private breadcrumbService: BreadcrumbService) {
  }

  ngOnInit() {
    this.alertService.success('Success!!', "tresc")
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRestaurant")) {
        const id = paramMap.get("idRestaurant");
        this.restaurantService.getPosRestaurantId(id).subscribe(response => {
          this.restaurant = response
          this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.restaurant.name);
        })
      }

    })
  }

}
