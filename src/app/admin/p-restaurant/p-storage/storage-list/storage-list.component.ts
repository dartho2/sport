import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { map } from 'rxjs/operators';
import { exportData } from "../../../products/export/exportData";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
export interface ProductData {
  id: string;
  name: string;
    nettoPrice: string;
    vat: string;
    bruttoPrice: string;
    weight: string;
    unit: string;
    details: string;
}
import { StorageService } from '../storage.service';
import { Storage } from '../storage.model'
import { AlertService } from 'src/app/_alert/alert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {
  productData;
  repos: Observable<any>;
  product = null;
  dataSource = new MatTableDataSource<ProductData>();
  displayedColumns: string[] = [
    'image',
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
  restaurant: any;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private route: ActivatedRoute, private storageService: StorageService,
    private alertService: AlertService) {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getmember(a) {
    return parseFloat(a).toFixed(2)
  }
  productDelete(id){
    if(confirm("Produkt id: " +id+" zostanie na stałe usunięty wraz z historia, jesteś pewien ?")) {
      this.storageService.deleteStorageProduct(id).subscribe(() => {
        this.alertService.info("Success","Deleted")        
    })
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idStorage")) {
        const id = paramMap.get("idStorage");
        this.storageService.getPosStorage(id).subscribe(response => {
          this.product = response
          this.productData = this.product.products;
          this.dataSource.data = this.productData;
          console.log(this.product, "this.product")
        })
      }

    })
  
  }
  exportTable() {
    exportData.exportToExcel("ExampleTable");
  }
}

