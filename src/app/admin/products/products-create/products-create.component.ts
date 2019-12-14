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
  mode;
  bodyForm: FormGroup;
  selectedValue;
  product: Product;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router, private productService: ProductService) {
    
  }

  ngOnInit() {
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
      weight: new FormControl(null)

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idProduct")) {
        this.mode = "edit";
        this.productId = paramMap.get("idProduct");
        this.productService.getProductID(this.productId).subscribe(productData => {
          this.product = {
            _id: productData._id,
            name: productData.name,
            description: productData.description,
            label: productData.label,
            logo: productData.logo,
            image: productData.image,
            style: productData.style,
            active: productData.active,
            price: productData.price,
            unit: productData.unit,
            weight: productData.weight
          };
          console.log("product =" ,this.product);
          this.bodyForm.setValue({
            _id: this.product._id,
            name: this.product.name,
            description: this.product.description,
            label: this.product.label,
            logo: this.product.logo,
            image: this.product.image,
            style: this.product.style,
            active: this.product.active,
            price: this.product.price,
            unit: this.product.unit,
            weight: this.product.weight
          });
        })
      } else {
        this.mode = "create";
      }
    });
  }
  onAddContent() {
    if (this.mode === "edit") {
      this.productService.updateProduct(this.bodyForm.value).subscribe(response => {
        console.log("update- done!", response)})
    } else {
      delete this.bodyForm.value._id
      this.bodyForm.value.price = this.bodyForm.value.price.replace(',', '.');
      this.bodyForm.value.weight = this.bodyForm.value.weight.replace(',', '.');
     
      this.productService.createProduct(this.bodyForm.value).subscribe(()=>
      {
        this.router.navigate(["../"], {relativeTo: this.route});
      })
    };
  }
  gotoBack(){
    this.router.navigate(["../"], {relativeTo: this.route});
  }

  
  // buildForm(data: any): FormGroup {
  //   console.log(data)
  //   return this.bodyForm = this._fb.group({
  //     name: [data ? data.name : ''],
  //   description: [data ? data.name : ''],
  //   label:[data ? data.name : ''],
  //   logo: [data ? data.name : ''],
  //   image:[data ? data.name : ''],
  //   style:[data ? data.name : ''],
  //   active:[data ? data.name : ''],
  //   price: [data ? data.name : ''],
  //   unit:[data ? data.name : ''],
  //   })
  // }

  
  onChange(selectedValue) {
    console.log(selectedValue)
  }
}