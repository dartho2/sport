import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BreadcrumbService } from 'angular-crumbs/breadcrumb.service';
import { DishServices } from '../dish-services';

@Component({
  selector: 'app-dish-show',
  templateUrl: './dish-show.component.html',
  styleUrls: ['./dish-show.component.css']
})
export class DishShowComponent implements OnInit {
  dish;
  constructor(private route: ActivatedRoute, private dishService: DishServices, private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idDishe")) {
        const id = paramMap.get("idDishe");
        this.dishService.getDishID(id).subscribe(response => {
          this.dish = response
          this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.dish.name);
        })
      }

    })
    
  }

}
