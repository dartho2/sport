import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { BreadcrumbService } from 'angular-crumbs';

@Component({
  selector: 'app-recipe-show',
  templateUrl: './recipe-show.component.html',
  styleUrls: ['./recipe-show.component.css']
})
export class RecipeShowComponent implements OnInit {
  recipeItemsId;
  product: Object;
  isDataAvailable: boolean = false;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRecipeitems")) {
        this.recipeItemsId = paramMap.get("idRecipeitems");
        this.recipeService.getRecipeitemsID(this.recipeItemsId).subscribe(response => {
          this.product = response
          this.isDataAvailable =true;
        })
      } 
    })
  }

}
