import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { map } from 'rxjs/operators';
import { exportData } from "../../../../products/export/exportData";
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
import { StorageService } from '../../storage.service';
import { Storage } from '../../storage.model'
import { AlertService } from 'src/app/_alert/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/admin/shared/dialog/dialog.component';

@Component({
  selector: 'app-p-products-list',
  templateUrl: './p-products-list.component.html',
  styleUrls: ['./p-products-list.component.css']
})
export class PProductsListComponent implements OnInit {
  productData;
  buttonTable: Boolean = true;
  product = null;
  checked = true;
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
      console.log(filterValue, "filterValue")
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log(this.dataSource,"filter")
    }
  
    constructor(public dialog: MatDialog, private route: ActivatedRoute, private storageService: StorageService,
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
          })
        }
  
      })
    }
    
    onValChange(a) {
      this.buttonTable = !this.buttonTable
    }
    exportTable() {
      exportData.exportToExcel("ExampleTable");
    }
    openDialog(product) {
      const dialogRef = this.dialog.open(DialogComponent,{
          disableClose: false,
        panelClass: "my-full-screen-dialog",
        data: {
          message: product,
          type: "product"
  }    });
    }
  }