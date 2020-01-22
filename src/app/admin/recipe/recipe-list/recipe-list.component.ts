import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../products/product.service'
import { Subscription } from 'rxjs';
import { Product } from '../../products/product.model';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements AfterViewInit, OnInit {
  recipeProducts;
  productData;
  products;
  dataSource = new MatTableDataSource(this.products);
  displayedColumns: string[] =[
    'name',
    "nettoPrice",
    "vat",
    "bruttoPrice",
    "weight",
    "unit",
    "_id"];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  private productsSub: Subscription;
  constructor(public productService: ProductService) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.productService.getProduct()
    .pipe(
      map(product => {
      return  product.filter(product => product.supplier === 'Re');
      })
    ).subscribe(products => {
     this.products = products
     this.dataSource = this.products
    });
  }

}
