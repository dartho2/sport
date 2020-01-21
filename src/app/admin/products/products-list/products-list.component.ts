import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { map } from 'rxjs/operators';
import { exportData } from "../export/exportData";

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
    'image',
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

  constructor(private route: ActivatedRoute, private productService: ProductService) {
    this.productService.getProduct()
      .pipe(
        map(product => {
          return product.filter(product => product.supplier !== 'Re' && product.supplier !== 'Pp');
        })
      ).subscribe(response => {
        this.product = response
        this.productData = this.product;
        this.dataSource.data = this.productData;
      });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getmember(a) {
    return parseFloat(a).toFixed(2)
  }
  ngOnInit() { }
  exportTable() {
    exportData.exportToExcel("ExampleTable");
  }
}
