import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RecipeService } from '../recipe.service'
import { Subscription } from 'rxjs';
import { Products } from '../../products/product.model';
import { map } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../../storage.service';
export interface UserData {
  id: string;
  name: string;
    nettoPrice: string;
    vat: string;
    bruttoPrice: string;
    weight: string;
    unit: string;
    details: string;
}
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements AfterViewInit, OnInit {
  recipeProducts;
  recipesData: any;
  recipes;
  checked = true;
  storage: any;
  buttonTable: Boolean = true;
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] =[
    'name',
    "nettoPrice",
    "vat",
    "bruttoPrice",
    "weight",
    "unit",
    "details",
    "update",
    "delete"];
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  private productsSub: Subscription;
  constructor(public storageService: StorageService, private route: ActivatedRoute, 
    private recipeService: RecipeService) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onValChange(a) {
    this.buttonTable = !this.buttonTable
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idRecipe")) {
        const id = paramMap.get("idRecipe");
        this.recipeService.getPosRecipe(id).subscribe(response => {
          this.storage = response
          this.recipesData = this.storage.recipeitems;
          this.dataSource.data = this.recipesData; 
        })
      }

    })

  }
  productDelete(id){
  }

}
