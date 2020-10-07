import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../../products/product.service'
import { Subscription } from 'rxjs';
import { Products } from '../../products/product.model';
import { map } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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
  productData;
  products;
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
     console.log("recipe", this.dataSource)
    });
  }
  productDelete(id){
    if(confirm("Are you sure to delete "+id)) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.productService.getProduct().subscribe(response => {
          this.products = response
          this.productData = this.products;
          this.dataSource = this.productData;
         console.log("usuniete", id)
        });
        
    })
    }
  }

}
