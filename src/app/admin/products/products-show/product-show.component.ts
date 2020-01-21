import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-show',
  templateUrl: './product-show.component.html',
  styleUrls: ['./product-show.component.css']
})
export class ProductShowComponent implements OnInit {
  product;
  productId;
  constructor(private route: ActivatedRoute,private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.productId = paramMap.get("id");
        this.productService.getProductID(this.productId).subscribe(productData => {
          this.product = productData
          
        })
      } 
    })
  }

}
