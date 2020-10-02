import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DishServices } from '../../dish/dish-services';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../../dish/dish.model';
import {MatDialog,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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
import * as _ from 'lodash';
import { RestaurantService } from '../../shared/restaurants/restaurants.service';
import { AlertService } from 'src/app/_alert/alert.service';
export interface DialogData {
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
  
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  constructor(public dialog: MatDialog,private restaurantService: RestaurantService, 
    private route: ActivatedRoute, private dishService: DishServices,private alertService: AlertService) { 
    this.restaurantService.getRestaurant().subscribe(response=>{
      this.valueRe  = response
      
  })
    this.dishService.getDish().subscribe(response => {
      this.dish = response
      this.dishData = this.dish;
     this.dataSource.data = _.sortBy(this.dishData, 'category')   
    });
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
  
  }
  dishDelete(id){
    if(confirm("Are you sure to delete "+id)) {
      this.dishService.deleteDish(id).subscribe(() => {
        this.alertService.info("Success","Deleted")
        this.dishService.getDish().subscribe(response => {
          this.dish = response
          this.dishData = this.dish;
         this.dataSource.data = this.dishData;  
         console.log("usuniete", id)
        });
        
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
