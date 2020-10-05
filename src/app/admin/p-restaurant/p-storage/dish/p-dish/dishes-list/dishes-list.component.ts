import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DishServices } from '../dish-services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Dish } from '../dish.model';
import {MatDialog,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import * as _ from 'lodash';
import { RestaurantService } from '../../../../../shared/restaurants/restaurants.service';
import { AlertService } from 'src/app/_alert/alert.service';
import { StorageService } from '../../../storage.service';
export interface DialogData {
}
export interface DishData {
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
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DishesListComponent implements AfterViewInit, OnInit {
  dish; 
  buttonTable: any;
  checked= true;
  dishData;
  valueRe;
  filDish ="Hosomaki";
  dataSource= new MatTableDataSource<DishData>();
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'bruttoPrice',
    'foodCost',
    'productMarginFC',
    'details',
    'update',
    'delete'
    ];
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
  storage: any;
  dishesData: any;
  
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  constructor(public dialog: MatDialog,private restaurantService: RestaurantService, 
    private route: ActivatedRoute, private dishService: DishServices,private alertService: AlertService,
    private storageService: StorageService) { 
    this.restaurantService.getRestaurant().subscribe(response=>{
      this.valueRe  = response
      
  })
    // this.dishService.getDish().subscribe(response => {
    //   this.dish = response
    //   this.dishData = this.dish;
    //  this.dataSource.data = _.sortBy(this.dishData, 'category')   
    // });
    }
    onChange(name){
      if(name !== 'All'){
        let newDate =  this.dishData.filter(x=> x.categoryRes === name);
        this.dataSource.data = newDate
      } else {
        this.dataSource.data = this.dish
      }
    }
    openDialog(dish) {
      this.dialog.open(DialogDataListDialog, {
        data: dish
      });
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
     onValChange(a){
      this.buttonTable = a
    }
  ngOnInit() {
    console.log("dish")
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idStorage")) {
        const id = paramMap.get("idStorage");
        this.storageService.getPosStorage(id).subscribe(response => {
          this.storage = response
          this.dishesData = this.storage.dishes;
          console.log(this.dishesData, "data")
          this.dataSource.data = this.dishesData;
          this.dataSource.data = _.sortBy(this.dishesData, 'category')   
        })
      }

    })
  }
  dishDelete(id){
    if(confirm("Are you sure to delete "+id)) {
      this.dishService.deleteDish(id).subscribe(() => {
        this.alertService.info("Success","Deleted")
    })
    }
  }
}
@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  styleUrls: ['./dialog-data-example-dialog.css'],
  
})
export class DialogDataListDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}