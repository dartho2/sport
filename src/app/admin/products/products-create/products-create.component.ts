import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Product} from '../product.model'
import { ProductService } from '../product.service';

@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent implements OnInit {
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  selectedOptions;
  selectPackage;
  productId;
  value: ['kg', 'szt' , 'l'];
  valueSupplier: ['KŚ', 'WoA' , 'W'];
  mode;
  bodyForm: FormGroup;
  selectedValue;
  product: Product;
  pr_data = new Date().toISOString()
  message;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService) {
    
  }

  ngOnInit() {
    console.log(this.pr_data)
    this.bodyForm = new FormGroup({
      _id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      label: new FormControl(null),
      logo: new FormControl(null),
      image: new FormControl(null),
      style: new FormControl(null),
      active: new FormControl(null),
      price: new FormControl(null),
      unit: new FormControl(null),
      weight: new FormControl(null),
      vat: new FormControl(null),
      totalPrice: new FormControl(null),
      product_data: new FormControl(null),
      supplier: new FormControl(null),
      history: this._fb.array([])
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.mode = "edit";
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(productData => {
          this.buildForm(productData);
        })
      } else {
        this.mode = "create";
      }
    });
  }
  buildForm(data: any): FormGroup {
    return this.bodyForm = this._fb.group({
      _id: [data ? data._id : null],
      name: [data ? data.name : '',],
      description: [data ? data.description : '',],
      label: [data ? data.label : '',],
      logo: [data ? data.logo : '',],
      image: [data ? data.image : '',],
      style: [data ? data.style : '',],
      active: [data ? data.active : '',],
      price:[data ? data.price : '',],
      unit: [data ? data.unit : '',],
      weight: [data ? data.weight : '',],
      vat: [data ? data.vat : '',],
      totalPrice: [data ? data.totalPrice : '',],
      supplier: [data ? data.supplier : '',],
      product_data: [data ? data.product_data : '',],
      history: this._fb.array(
        this.getHistory(data ? data.history : null)
      )
      // content: this._fb.array(
      //   this.getContent(data ? data.content : null),
      // ),
      // tags: this._fb.array(
      //   this.getTags(data ? data.tags : null)
      // ),
    })
  }
  getHistory(history: any): FormGroup[] {
    return history ? history.map(historyBody => {
      return this._fb.group({
        supplier: [historyBody.supplier],
        price: [historyBody.price],
        totalPrice: [historyBody.totalPrice],
        vat: [historyBody.vat],
        product_data: [historyBody.product_data],
      });
    }) : []
  }
  onAddContent() {
    if (this.mode === "edit") {
      this.bodyForm.controls['totalPrice'].patchValue(this.calculateTotalPrice(this.bodyForm.value)) 
      this.bodyForm.controls['product_data'].patchValue(this.pr_data);
      // (<FormArray>this.bodyForm.controls['history']).value.push({
      //   "supplier": this.bodyForm.value.supplier,
      //   "price": this.bodyForm.value.price,
      //   "totalPrice": this.bodyForm.value.totalPrice,
      //   "vat": this.bodyForm.value.vat,
      //   "product_data": this.bodyForm.value.product_data
      // });
      this.productService.updateProduct(this.bodyForm.value).subscribe(response => {
        this.message = response;
      })
    } else {
      delete this.bodyForm.value._id
      this.bodyForm.value.totalPrice = this.calculateTotalPrice(this.bodyForm.value)
      this.productService.createProduct(this.bodyForm.value).subscribe(()=>
      {
        this.router.navigate(["../"], {relativeTo: this.route});
      })
    };
  }
  calculateTotalPrice(price){
    this.bodyForm.value.price = this.bodyForm.value.price.replace(',', '.');
    this.bodyForm.value.weight = this.bodyForm.value.weight.replace(',', '.');
   
    this.bodyForm.controls['product_data'].patchValue(this.pr_data);
    this.bodyForm.value.totalPrice = (price.price * (price.vat / 100 + 1)).toFixed(2);
    this.bodyForm.controls['totalPrice'].patchValue(this.bodyForm.value.totalPrice);
     (<FormArray>this.bodyForm.controls['history']).value.push({
      "supplier": this.bodyForm.value.supplier,
      "price": this.bodyForm.value.price,
      "totalPrice": this.bodyForm.value.totalPrice,
      "vat": this.bodyForm.value.vat,
      "product_data": this.bodyForm.value.product_data
    });
    return  this.bodyForm.value.totalPrice
  }
  gotoBack(){
    this.router.navigate(["../"], {relativeTo: this.route});
  }
}