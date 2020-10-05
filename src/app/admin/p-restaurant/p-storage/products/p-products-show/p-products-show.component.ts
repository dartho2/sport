import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from '../product.service';
import { Products } from '../product.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { BreadcrumbService } from 'angular-crumbs';


@Component({
  selector: 'app-p-products-show',
  templateUrl: './p-products-show.component.html',
  styleUrls: ['./p-products-show.component.css']
})
export class PProductsShowComponent implements OnInit {
  product: Products;
  productId;
  dupa: any[];
  isDataAvailable = false;
  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Crude oil prices' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  

  constructor(private route: ActivatedRoute,private productService: ProductService, private router: Router,private datePipe: DatePipe, private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(response => {
          this.product = response
          this.dupa = this.product.history.map(x => x.nettoPrice);
          this.lineChartData =  [{data: this.dupa, label: 'Cena Netto'}];
          this.lineChartLabels = this.product.history.map(x => (this.datePipe.transform(new Date(x.productDate))))
          this.isDataAvailable =true;
          this.breadcrumbService.changeBreadcrumb(this.route.snapshot, this.product.name);
        })
      } 
    })
  }

}
