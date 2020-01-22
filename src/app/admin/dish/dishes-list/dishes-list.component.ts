import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DishServices } from '../../dish/dish-services';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../../dish/dish.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';


export interface DialogData {
}

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DishesListComponent implements AfterViewInit, OnInit {
  dish; 
  buttonTable: any;
  checked= true;
  dishData;
  dataSource = new MatTableDataSource(this.dishData);
  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'bruttoPrice',
    'foodCost',
    'productMarginFC',
    '_id'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    

    

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  

   

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private dishService: DishServices) { 
    this.dishService.getDish().subscribe(response => {
      this.dish = response
      this.dishData = this.dish;
     this.dataSource.data = this.dishData;  
    });
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
