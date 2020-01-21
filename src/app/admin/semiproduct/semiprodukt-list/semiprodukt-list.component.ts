import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../products/product.service'
import { Subscription } from 'rxjs';
import { Product } from '../../products/product.model';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-semiprodukt-list',
  templateUrl: './semiprodukt-list.component.html',
  styleUrls: ['./semiprodukt-list.component.css']
})
export class SemiproduktListComponent implements OnInit {

  semiProducts;
  productData;
  products;
  dataSource = new MatTableDataSource(this.products);
  displayedColumns: string[] = [
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
      return  product.filter(product => product.supplier === 'Pp');
      })
    ).subscribe(products => {
     this.products = products
     this.dataSource = this.products
    })
  }
}
