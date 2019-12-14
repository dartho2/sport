import { Component, OnInit, ViewChild } from '@angular/core';
import { DishServices } from '../../dish/dish-services';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../../dish/dish.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css']
})
export class DishesListComponent implements OnInit {
  dish;
  dishData;
  dataSource = new MatTableDataSource(this.dishData);
  displayedColumns: string[] = ['name',
    "price" ,
    "price_p"
    ];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  constructor(private route: ActivatedRoute, private dishService: DishServices) { 
    this.dishService.getDish().subscribe(response => {
      this.dish = response
      this.dishData = this.dish;
     this.dataSource.data = this.dishData;  
    });
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     }

  ngOnInit() {
  }

}
