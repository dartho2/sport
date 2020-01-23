import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-show',
  templateUrl: './product-show.component.html',
  styleUrls: ['./product-show.component.css']
})
export class ProductShowComponent implements OnInit {
  product: Product;
  productId;
  constructor(private route: ActivatedRoute,private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(response => {
          this.product = response
        })
      } 
    })
  }

}
