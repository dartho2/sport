import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { map } from 'rxjs/operators';
import { exportData } from "../../../products/export/exportData";
import { NotificationService } from '../../../toastr-notification/toastr-notification.service'; 
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

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {
  productData;
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
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private route: ActivatedRoute, private storageService: StorageService, private notification: NotificationService) {
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
        this.notification.info("Success. Deleted")        
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
        })
      }

    })
  }
  exportTable() {
    exportData.exportToExcel("ExampleTable");
  }
}

