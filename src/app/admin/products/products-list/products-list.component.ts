import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {MatPaginator, MatSort} from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements AfterViewInit, OnInit {
    productData;
    product;
    dataSource = new MatTableDataSource(this.productData);
    displayedColumns: string[] = [
    'name',
    "price" ,
    "unit",
    "weight",
    "vat",
    "_id",
  "totalPrice" ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  constructor(private route: ActivatedRoute, private productService: ProductService) { 
    this.productService.getProduct().subscribe(response => {
      this.product = response
     this.productData = this.product;
     this.dataSource.data = this.productData;  
     console.log(this.product)
    });
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     }
    getmember(a) {
      return parseFloat(a).toFixed(2)
    }  
    // calculate(a) {
    //   return parseFloat(a)*5;
    // }
  ngOnInit() {
  
    // this.route.paramMap.subscribe(param => {
    //   this.productService.getProduct().subscribe(response => {
    //     this.product = response
    //   })
    // })

  }

}
